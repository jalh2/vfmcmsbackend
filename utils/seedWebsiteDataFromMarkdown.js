require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config');

const HomePage = require('../models/homePageModel');
const AboutPage = require('../models/aboutPageModel');
const BuildingProjectPage = require('../models/buildingProjectPageModel');
const GalleryPage = require('../models/galleryPageModel');
const ActivitiesPage = require('../models/activitiesPageModel');
const TestimoniesPage = require('../models/testimoniesPageModel');
const ContactPage = require('../models/contactPageModel');
const AcademyPage = require('../models/academyPageModel');
const ClinicPage = require('../models/clinicPageModel');
const RehabPage = require('../models/rehabPageModel');
const ActsFellowshipPage = require('../models/actsFellowshipPageModel');
const ResourcesPage = require('../models/resourcesPageModel');
const DonatePage = require('../models/donatePageModel');

const upsertIfEmpty = async (Model, name, data) => {
  const existing = await Model.findOne();
  if (existing) {
    console.log(`${name} already exists, skipping.`);
    return existing;
  }
  const created = await Model.create(data);
  console.log(`${name} created from markdown.`);
  return created;
};

const parseKeyValuePairs = (block) => {
  const result = {};
  if (!block) return result;

  const regex = /^([a-zA-Z0-9_]+):\s*(.+)$/gm;
  let match;
  while ((match = regex.exec(block))) {
    const key = match[1].trim();
    const value = match[2].trim();
    result[key] = value;
  }
  return result;
};

const parseOrgMetadata = (content) => {
  const marker = '## ORGANIZATION METADATA';
  const start = content.indexOf(marker);
  if (start === -1) return {};

  const rest = content.slice(start + marker.length);
  const endIndex = rest.indexOf('---');
  const block = endIndex !== -1 ? rest.slice(0, endIndex) : rest;
  return parseKeyValuePairs(block);
};

const extractPageSection = (content, pageId) => {
  const pattern = new RegExp(`page_id:\\s*${pageId}([\\s\\S]*?)\n---`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[0];
};

const parseHeroMessages = (homeSection) => {
  if (!homeSection) return [];
  const messages = [];
  const regex = /message_(\\d+):\s*(.+)/g;
  let match;
  while ((match = regex.exec(homeSection))) {
    const order = parseInt(match[1], 10) || undefined;
    const title = match[2].trim();
    messages.push({ title, order });
  }
  return messages;
};

const parseActivitiesFromChurchActivitiesSection = (section) => {
  if (!section) {
    return { weekly: [], monthly: [], yearly: [] };
  }

  const lines = section.split('\n').map((l) => l.trim());
  let mode = null;
  const weekly = [];
  const monthly = [];
  const yearly = [];

  for (const line of lines) {
    if (line.startsWith('### WEEKLY ACTIVITIES')) {
      mode = 'weekly';
      continue;
    }
    if (line.startsWith('### MONTHLY ACTIVITIES')) {
      mode = 'monthly';
      continue;
    }
    if (line.startsWith('### YEARLY ACTIVITIES')) {
      mode = 'yearly';
      continue;
    }

    if (!mode || !line || line.startsWith('#')) continue;

    const kvMatch = /^([^:]+):\s*(.+)$/.exec(line);
    if (!kvMatch) continue;

    const day = kvMatch[1].trim();
    const rest = kvMatch[2].trim();

    const pipeIndex = rest.indexOf('|');
    let title;
    let time;

    if (pipeIndex !== -1) {
      title = rest.slice(0, pipeIndex).trim();
      time = rest.slice(pipeIndex + 1).trim();
    } else {
      title = rest.trim();
      time = '';
    }

    const activity = {
      day,
      title,
      time,
    };

    if (mode === 'weekly') weekly.push(activity);
    if (mode === 'monthly') monthly.push(activity);
    if (mode === 'yearly') yearly.push(activity);
  }

  weekly.forEach((a, index) => {
    a.displayOrder = index + 1;
  });
  monthly.forEach((a, index) => {
    a.displayOrder = index + 1;
  });
  yearly.forEach((a, index) => {
    a.displayOrder = index + 1;
  });

  return { weekly, monthly, yearly };
};

const parseBranches = (aboutSection) => {
  if (!aboutSection) return [];
  const lines = aboutSection.split('\n').map((l) => l.trim());
  const branches = [];
  let inBranches = false;

  for (const line of lines) {
    if (line.startsWith('branches:')) {
      inBranches = true;
      continue;
    }
    if (inBranches) {
      if (!line.startsWith('-')) break;
      const raw = line.replace(/^-/,'').trim();
      if (!raw) continue;
      const name = raw;
      let location = 'Liberia';
      let isInternational = false;
      const lower = name.toLowerCase();
      if (lower.includes('sierra leone')) {
        location = 'Sierra Leone';
        isInternational = true;
      } else if (lower.includes('guinea')) {
        location = 'Guinea';
        isInternational = true;
      }
      branches.push({ name, location, isInternational });
    }
  }
  return branches;
};

const parseChurchStructureDepartments = (aboutSection) => {
  if (!aboutSection) return [];
  const lines = aboutSection.split('\n').map((l) => l.trim());
  const departments = [];
  let currentType = null;

  for (const line of lines) {
    if (line.startsWith('MINISTERIAL DEPARTMENT')) {
      currentType = 'ministerial';
      continue;
    }
    if (line.startsWith('ADMINISTRATIVE DEPARTMENT')) {
      currentType = 'administrative';
      continue;
    }
    if (line.startsWith('FUNCTIONAL DEPARTMENTS')) {
      currentType = 'functional';
      continue;
    }

    if (!currentType) continue;

    if (!line || line.startsWith('#')) {
      currentType = null;
      continue;
    }

    if (line.startsWith('-')) {
      const items = line
        .replace(/^-+/, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const name of items) {
        departments.push({ name, type: currentType });
      }
    }
  }

  return departments;
};

const parseTestimonyCategories = (section) => {
  if (!section) return [];
  const lines = section.split('\n').map((l) => l.trim());
  const categories = [];
  let current = null;

  for (const line of lines) {
    const typeMatch = /^Type\s+\d+\s*-\s*(.+):/.exec(line);
    if (typeMatch) {
      if (current) categories.push(current);
      current = { name: typeMatch[1].trim(), descriptionLines: [] };
      continue;
    }

    if (current && line.startsWith('description:')) {
      current.descriptionLines.push(line.replace('description:', '').trim());
    }
  }

  if (current) categories.push(current);

  return categories.map((cat) => {
    const lower = cat.name.toLowerCase();
    let key = 'other';
    if (lower.includes('salvation')) key = 'salvation';
    else if (lower.includes('healing')) key = 'healing';
    else if (lower.includes('family')) key = 'family';
    else if (lower.includes('youth')) key = 'youth';

    return {
      key,
      name: cat.name,
      description: cat.descriptionLines.join(' '),
    };
  });
};

const buildPageObjectsFromMarkdown = (rawContent) => {
  const content = rawContent.replace(/\r\n/g, '\n');

  const orgMeta = parseOrgMetadata(content);

  const homeSection = extractPageSection(content, 'home');
  const aboutSection = extractPageSection(content, 'about-church');
  const buildingProjectSection = extractPageSection(content, 'building-project');
  const gallerySection = extractPageSection(content, 'gallery');
  const churchActivitiesSection = extractPageSection(content, 'church-activities');
  const testimoniesSection = extractPageSection(content, 'testimonies');
  const contactSection = extractPageSection(content, 'contact');
  const academySection = extractPageSection(content, 'academy-refuge');
  const clinicSection = extractPageSection(content, 'clinic');
  const rehabProgramSection = extractPageSection(content, 'rehab-program');
  const actsFellowshipSection = extractPageSection(content, 'acts-fellowship');
  const resourcesSection = extractPageSection(content, 'training-resources');

  const orgName = orgMeta.org_name || 'Victorious Faith Ministries';
  const orgSubtitle = orgMeta.org_subtitle || 'Redemption Chapel';
  const organizationName = `${orgName}${orgSubtitle ? ' - ' + orgSubtitle : ''}`;
  const organizationAddress = orgMeta.org_location || '';
  const organizationPhone = orgMeta.org_phone || '';
  const organizationEmail = orgMeta.org_email || '';
  const organizationWebsite = orgMeta.org_website || '';
  const foundedYear = orgMeta.org_founded ? parseInt(orgMeta.org_founded.replace(/[^0-9]/g, ''), 10) : undefined;
  const membersCount = orgMeta.org_members ? parseInt(orgMeta.org_members.replace(/[^0-9]/g, ''), 10) : undefined;
  const branchesCount = orgMeta.org_branches ? parseInt(orgMeta.org_branches.replace(/[^0-9]/g, ''), 10) : undefined;

  const activities = parseActivitiesFromChurchActivitiesSection(churchActivitiesSection);

  const heroMessages = parseHeroMessages(homeSection);

  const weeklySnippet = activities.weekly
    .map((a) => `${a.day}: ${a.title}${a.time ? ' (' + a.time + ')' : ''}`)
    .join(' | ');
  const monthlySnippet = activities.monthly
    .map((a) => `${a.day}: ${a.title}${a.time ? ' (' + a.time + ')' : ''}`)
    .join(' | ');
  const yearlySnippet = activities.yearly
    .map((a) => `${a.day}: ${a.title}${a.time ? ' (' + a.time + ')' : ''}`)
    .join(' | ');

  const mottoText = orgMeta.org_motto || 'LIGHTING THE WORLD THROUGH THE WORD';

  const homePageData = {
    header: {
      organizationName,
    },
    heroMessages,
    heroImages: [],
    mottoText,
    featuredActivities: {
      weeklySnippet,
      monthlySnippet,
      yearlySnippet,
    },
    featuredNewsSnippet: {
      title: 'Key Programs & Events',
      summary:
        'Explore our weekly services, church anniversary and ARISE SUMMIT global program, and the ongoing building project.',
      linkUrl: '',
    },
    featuredPrograms: [
      {
        key: 'academy',
        title: 'Victorious Faith Academy & Refuge Home',
        description:
          'Day-care to 9th grade program providing shelter, parental care and Christian education for orphans and less privileged children.',
        order: 1,
      },
      {
        key: 'clinic',
        title: 'Victorious Faith Community Clinic',
        description:
          'Only health facility in Battery Factory Community, established after a tragic incident to serve families with compassionate care.',
        order: 2,
      },
      {
        key: 'rehab',
        title: 'Addict to Disciple Program',
        description:
          'A discipleship-based rehabilitation program helping addicts find freedom through Christ.',
        order: 3,
      },
      {
        key: 'actsFellowship',
        title: 'Acts Fellowship International',
        description:
          'West Africa leadership training movement using the Book of Acts model to equip church leaders.',
        order: 4,
      },
    ],
    contactSection: {
      phone: organizationPhone,
      email: organizationEmail,
      location: organizationAddress,
      contactFormSnippet: 'Get in touch for prayer, inquiries, and partnership opportunities.',
    },
    footer: {
      organizationName,
      phone: organizationPhone,
      email: organizationEmail,
      address: organizationAddress,
      socialLinks: [],
      copyrightText: `© ${new Date().getFullYear()} ${orgName}. All rights reserved.`,
    },
  };

  const aboutPairs = parseKeyValuePairs(aboutSection);
  const branches = parseBranches(aboutSection);
  const departments = parseChurchStructureDepartments(aboutSection);

  const aboutPageData = {
    header: {
      title: 'About Victorious Faith Ministries',
    },
    organizationBio: {
      text:
        'Victorious Faith Ministries (Redemption Chapel) exists for EVANGELISM, DISCIPLESHIP AND LEADERSHIP TRAINING in Monrovia, Liberia.',
    },
    mission: aboutPairs.mission_statement || 'EVANGELISM, DISCIPLESHIP AND LEADERSHIP TRAINING',
    vision:
      aboutPairs.philosophy ||
      'Evangelism is to WIN them and Discipleship is to TEACH them the whole truth of the word of God.',
    coreBeliefs:
      aboutPairs.core_belief ||
      'The only thing that has the power to shine LIGHT in this dark WORLD is the WORD of God.',
    motto: aboutPairs.org_motto || mottoText,
    history: {
      text: [
        aboutPairs.establishment_reason,
        aboutPairs.establishment_context,
        aboutPairs.establishment_purpose,
      ]
        .filter(Boolean)
        .join(' '),
    },
    founder: {
      name: aboutPairs.founder_name || orgMeta.org_founder || 'Bishop Andrew Gombay',
      title: aboutPairs.founder_title || 'General Overseer and Founder',
      bio:
        aboutPairs.founder_description ||
        'Experienced and charismatic teacher of the WORD of God with passion for the lost.',
    },
    headquartersAddress: [
      aboutPairs.headquarters_location,
      aboutPairs.headquarters_street,
      aboutPairs.headquarters_landmark,
      aboutPairs.headquarters_city,
      aboutPairs.headquarters_country,
    ]
      .filter(Boolean)
      .join(', '),
    branches,
    churchStructure: {
      departments,
    },
    growthStatistics: {
      membersCount: membersCount,
      branchesCount: branchesCount,
      internationalBranchesCount: branches.filter((b) => b.isInternational).length || undefined,
      foundedYear: foundedYear,
    },
    leadershipTeam: [],
  };

  const buildingPairs = parseKeyValuePairs(buildingProjectSection);

  const buildingProjectPageData = {
    header: {
      title: buildingPairs.page_title || 'Building Project',
    },
    projectOverview: {
      goal: buildingPairs.project_goal || 'Build a New Church Building',
      description:
        buildingPairs.project_reason ||
        'The area experiences severe flooding every year. The project aims to construct a solid, lasting church building with a protective fence.',
      estimatedBudget: buildingPairs.project_estimate
        ? parseInt(buildingPairs.project_estimate.replace(/[^0-9]/g, ''), 10)
        : 215000,
      timeline: '',
    },
    reasonAndImpact: {
      text:
        buildingPairs.flood_impact ||
        'The church goes through severe flood situations every year. A new building and protective fence are needed to provide a safe place of worship.',
    },
    floodGallery: [],
    donationCallToAction: {
      title: buildingPairs.call_to_action || 'We Need Your Support and Prayers',
      message:
        buildingPairs.project_quote ||
        'It is certainly a very big and impossible project for us, but with God, all things are possible.',
    },
    projectStatus: {
      statusText: 'Believing God for provision and progress on the building project.',
      progressPercentage: 0,
    },
    biblicalReference: {
      reference: buildingPairs.biblical_reference || 'Matthew 19:26',
      text: 'With God all things are possible.',
    },
  };

  const galleryPairs = parseKeyValuePairs(gallerySection);

  const galleryPageData = {
    header: {
      title: galleryPairs.page_title || 'Gallery',
    },
    description:
      galleryPairs.gallery_description ||
      'Church history gallery showcasing the journey and growth of Victorious Faith Ministries, including development stages and celebration highlights.',
    images: [],
  };

  const activitiesPageData = {
    header: {
      title: 'Church Activities',
    },
    overviewText:
      'Weekly, monthly, and yearly activities that shape the worship, discipleship, and outreach life of Victorious Faith Ministries.',
    weeklyActivities: activities.weekly,
    monthlyActivities: activities.monthly,
    yearlyActivities: activities.yearly,
  };

  const testimoniesPairs = parseKeyValuePairs(testimoniesSection);
  const testimonyCategories = parseTestimonyCategories(testimoniesSection);

  const testimoniesPageData = {
    header: {
      title: testimoniesPairs.page_title || 'Testimonies',
    },
    introText: testimoniesPairs.section_title || 'What God is Doing in Our Midst',
    categories: testimonyCategories,
  };

  const contactPairs = parseKeyValuePairs(contactSection);

  const contactPageData = {
    header: {
      title: contactPairs.page_title || 'Contact',
    },
    contactInfo: {
      address: contactPairs.location || organizationAddress,
      phone: contactPairs.phone || organizationPhone,
      email: contactPairs.email || organizationEmail,
      website: organizationWebsite,
    },
    location: {
      mapEmbedCode: '',
      mapUrl: '',
    },
    socialLinks: [],
  };

  const academyPairs = parseKeyValuePairs(academySection);

  const academyPageData = {
    header: {
      title:
        academyPairs.page_title || 'Victorious Faith Academy / Victorious Faith Refuge Home',
    },
    overviewText:
      academyPairs.establishment_purpose ||
      'Victorious Faith Academy serves children from day-care to 9th grade, extending the LOVE of Christ by providing shelter, parental care, and Christian education.',
    establishmentStory: {
      text:
        academyPairs.establishment_reason ||
        'After the civil war, many children were orphans or less privileged. The Academy and Refuge Home were established to extend the LOVE of Christ and provide shelter and parental care.',
    },
    historyText:
      academyPairs.start_configuration ||
      'The work started in a two-room small building serving about 30 children and later expanded through partnership with World Orphans.',
    programs: [
      {
        title: 'Day-care to 9th Grade Education',
        description:
          academyPairs.school_system ||
          'Comprehensive Christian education for children from day-care through 9th grade.',
      },
    ],
    facilitiesGallery: [],
    enrollmentInfo: {
      text:
        'For information about enrollment at Victorious Faith Academy or Refuge Home, please contact the ministry office.',
    },
  };

  const clinicPairs = parseKeyValuePairs(clinicSection);

  const clinicPageData = {
    header: {
      title: clinicPairs.page_title || 'Victorious Faith Community Clinic',
    },
    overviewText:
      clinicPairs.establishment_reason ||
      'Victorious Faith Community Clinic is the only health facility in Battery Factory Community, established after a tragic incident to serve the community with medical care.',
    establishmentStory: {
      text:
        clinicPairs.incident ||
        'The clinic was established after the pastor\'s son died in a car on the way to the nearest clinic at night, motivating the founder to establish a local clinic.',
    },
    services: [
      {
        title: 'Community Clinic and Medical Center',
        description:
          clinicPairs.current_role ||
          'Registered as a medical center and the only health facility in Battery Factory Community, providing care and support to local families.',
      },
      {
        title: 'Laboratory and Basic Care Services',
        description:
          clinicPairs.initial_resources ||
          'The clinic began with one old microscope and two volunteers and has grown into a big blessing to the community.',
      },
    ],
    galleryImages: [],
    contactInfo: {
      address: organizationAddress,
      phone: organizationPhone,
      email: organizationEmail,
    },
  };

  const rehabPairs = parseKeyValuePairs(rehabProgramSection);

  const rehabPageData = {
    header: {
      title: rehabPairs.page_title || 'Addict to Disciple Program',
    },
    overviewText:
      rehabPairs.program_name ||
      'Addict to Disciple is a discipleship-based rehabilitation program helping addicts find freedom in Christ.',
    startDate: rehabPairs.launch_date || 'January 1, 2016',
    motivationText:
      rehabPairs.observation_liberia ||
      'The program was born out of observing blood-shut eyes of youth on the streets, increased crime, and make-shift ghettos in many communities.',
    trainingText:
      rehabPairs.training_focus ||
      'The founder received training from experienced addiction specialists, including Dr. David Hinn, with a focus on effective and rigorous training on how to disciple an addict.',
    resultsText:
      rehabPairs.program_status ||
      'The program has seen phenomenal progress, with heart-rendering testimonies from men and women set free from addiction.',
    galleryImages: [],
  };

  const actsPairs = parseKeyValuePairs(actsFellowshipSection);

  const actsFellowshipPageData = {
    header: {
      title: actsPairs.page_title || 'Acts Fellowship International',
    },
    overviewText:
      actsPairs.vision_start ||
      'Acts Fellowship International is a leadership training movement that began during a leadership conference in Liberia.',
    foundedYear: actsPairs.vision_start
      ? parseInt(actsPairs.vision_start.replace(/[^0-9]/g, ''), 10)
      : 2013,
    visionText:
      actsPairs.vision_purpose ||
      'The vision is to reach out to leaders without formal pastoral or theological training, focusing on those teaching and preaching the word of God in challenged parts of the region.',
    partnershipsText:
      actsPairs.partnership_goal ||
      'Acts Fellowship was birthed through partnership with Pastor Bob and Dr. Dan, along with Bishop Andrew Gombay, to train church leaders and strengthen healthy churches across West Africa.',
    galleries: [],
  };

  const resourcesPairs = parseKeyValuePairs(resourcesSection);

  const resourcesPageData = {
    header: {
      title: resourcesPairs.page_title || 'Acts Fellowship Resource Page',
    },
    teachingVideos: [],
    otSessions: [],
    ntSessions: [],
    dbsSessions: [],
    nurturingSessions: [],
    audioLessons: [],
  };

  const donatePageData = {
    header: {
      title: 'Donate',
    },
    purposeText:
      'Partner with Victorious Faith Ministries to support the building project, Academy and Refuge Home, Community Clinic, Addict to Disciple Program, and Acts Fellowship leadership training across West Africa.',
    buildingProjectAppeal: {
      title: 'Support the Building Project',
      text:
        'Support the construction of a solid, lasting church building and protective fence in a flood-prone area. It is a very big and seemingly impossible project for us, but with God, all things are possible.',
    },
    campaigns: [
      {
        title: 'Church Building Project',
        description:
          'Help build a new church building and protective fence to provide a safe place of worship in a flood-affected area.',
      },
      {
        title: 'Victorious Faith Academy & Refuge Home',
        description:
          'Support day-care to 9th grade Christian education and shelter for orphans and less privileged children.',
      },
      {
        title: 'Victorious Faith Community Clinic',
        description:
          'Strengthen the only health facility in Battery Factory Community as it serves families with compassionate medical care.',
      },
      {
        title: 'Addict to Disciple Program',
        description:
          'Invest in discipleship-based rehabilitation for men and women being set free from addiction.',
      },
      {
        title: 'Acts Fellowship International',
        description:
          'Expand leadership training for church leaders across Liberia, Sierra Leone, and Guinea.',
      },
    ],
    impactMessages: [
      {
        title: 'Restoration, Healing, and Hope',
        description:
          'Every gift helps bring restoration, healing, and hope through the ministries of Victorious Faith to individuals, families, and communities.',
      },
      {
        title: 'Lighting the World Through the Word',
        description:
          'Your support helps Victorious Faith Ministries live out the motto: LIGHTING THE WORLD THROUGH THE WORD.',
      },
    ],
  };

  return {
    homePageData,
    aboutPageData,
    buildingProjectPageData,
    galleryPageData,
    activitiesPageData,
    testimoniesPageData,
    contactPageData,
    academyPageData,
    clinicPageData,
    rehabPageData,
    actsFellowshipPageData,
    resourcesPageData,
    donatePageData,
  };
};

const seedFromMarkdown = async () => {
  try {
    const markdownPath = path.join(__dirname, '..', '..', 'website-data.md');
    const rawContent = fs.readFileSync(markdownPath, 'utf8');

    const {
      homePageData,
      aboutPageData,
      buildingProjectPageData,
      galleryPageData,
      activitiesPageData,
      testimoniesPageData,
      contactPageData,
      academyPageData,
      clinicPageData,
      rehabPageData,
      actsFellowshipPageData,
      resourcesPageData,
      donatePageData,
    } = buildPageObjectsFromMarkdown(rawContent);

    await connectDB();

    await upsertIfEmpty(HomePage, 'HomePage', homePageData);
    await upsertIfEmpty(AboutPage, 'AboutPage', aboutPageData);
    await upsertIfEmpty(BuildingProjectPage, 'BuildingProjectPage', buildingProjectPageData);
    await upsertIfEmpty(GalleryPage, 'GalleryPage', galleryPageData);
    await upsertIfEmpty(ActivitiesPage, 'ActivitiesPage', activitiesPageData);
    await upsertIfEmpty(TestimoniesPage, 'TestimoniesPage', testimoniesPageData);
    await upsertIfEmpty(ContactPage, 'ContactPage', contactPageData);
    await upsertIfEmpty(AcademyPage, 'AcademyPage', academyPageData);
    await upsertIfEmpty(ClinicPage, 'ClinicPage', clinicPageData);
    await upsertIfEmpty(RehabPage, 'RehabPage', rehabPageData);
    await upsertIfEmpty(ActsFellowshipPage, 'ActsFellowshipPage', actsFellowshipPageData);
    await upsertIfEmpty(ResourcesPage, 'ResourcesPage', resourcesPageData);
    await upsertIfEmpty(DonatePage, 'DonatePage', donatePageData);

    console.log('Website seed data from markdown completed.');
  } catch (err) {
    console.error('Error seeding website data from markdown:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedFromMarkdown();
