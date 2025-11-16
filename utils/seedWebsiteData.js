require('dotenv').config();
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
  console.log(`${name} created.`);
  return created;
};

const seed = async () => {
  try {
    await connectDB();

    const organizationName = 'Victorious Faith Ministries - Redemption Chapel';
    const organizationAddress = 'Battery Factory, Gardnerville road, Monrovia, Liberia';
    const organizationPhone = '+231 0775-024-032';
    const organizationEmail = 'victoriousfaithfund@gmail.com';
    const organizationWebsite = 'https://faithinafrica.org';

    // HOME PAGE
    const homePageData = {
      header: {
        organizationName,
      },
      heroMessages: [
        {
          title: 'Prayer is the pillar of our strength',
          order: 1,
        },
        {
          title: 'Motto: Lighting the world through the word',
          order: 2,
        },
        {
          title: 'Extend the LOVE of Christ to them',
          order: 3,
        },
      ],
      mottoText: 'LIGHTING THE WORLD THROUGH THE WORD',
      featuredActivities: {
        weeklySnippet:
          'Sunday worship and discipleship, Thursday fast and prayer, Saturday leadership training and Youths on Fire.',
        monthlySnippet:
          'MAXIMUM IMPACT prayer service on the last day of the month and baptism of new converts on the last Saturday.',
        yearlySnippet:
          'Church Anniversary/Convention in April and ARISE SUMMIT (Global Program) in November.',
      },
      featuredNewsSnippet: {
        title: 'Building Project & ARISE SUMMIT',
        summary:
          'Partner with Victorious Faith Ministries in the building project and the annual ARISE SUMMIT global program.',
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
            'Program discipling addicts and helping them find freedom through Christ with structured training and support.',
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
        copyrightText: `© ${new Date().getFullYear()} Victorious Faith Ministries. All rights reserved.`,
      },
    };

    // ABOUT PAGE
    const aboutPageData = {
      header: {
        title: 'About Victorious Faith Ministries',
      },
      organizationBio: {
        text:
          'Victorious Faith Ministries (Redemption Chapel) exists for EVANGELISM, DISCIPLESHIP AND LEADERSHIP TRAINING in Monrovia, Liberia.',
      },
      mission: 'EVANGELISM, DISCIPLESHIP AND LEADERSHIP TRAINING',
      vision:
        'Evangelism is to WIN them and Discipleship is to TEACH them the whole truth of the word of God.',
      coreBeliefs:
        'The only thing that has the power to shine LIGHT in this dark WORLD is the WORD of God.',
      motto: 'LIGHTING THE WORLD THROUGH THE WORD',
      history: {
        text:
          'Victorious Faith Ministries began after the last segment of a 15-year rebel and civil war. The war left the people and nation battered and in ruins, and the ministry was established for genuine restoration, healing, and hope through Christ Jesus.',
      },
      founder: {
        name: 'Bishop Andrew Gombay',
        title: 'General Overseer and Founder',
        bio: 'Experienced and charismatic teacher of the WORD of God with passion for the lost.',
      },
      headquartersAddress:
        'Battery Factory, Gardnerville road, opposite Patrol Trade Gas station, Monrovia, Liberia',
      branches: [
        {
          name: 'VFM Central Church',
          location: 'Monrovia, Liberia',
          isInternational: false,
        },
        {
          name: 'VFM Virginia Branch',
          location: 'Liberia',
          isInternational: false,
        },
        {
          name: 'VFM Lofa County Branch',
          location: 'Liberia',
          isInternational: false,
        },
        {
          name: 'VFM Fefe Town Todee Branch',
          location: 'Liberia',
          isInternational: false,
        },
        {
          name: 'VFM Sierra Leone Branch',
          location: 'Sierra Leone',
          isInternational: true,
        },
        {
          name: 'VFM Conakry Guinea Branch',
          location: 'Guinea',
          isInternational: true,
        },
      ],
      churchStructure: {
        departments: [
          // Ministerial
          { name: 'Pastors', type: 'ministerial' },
          { name: 'Deacons', type: 'ministerial' },
          { name: 'Ministers', type: 'ministerial' },
          { name: 'Elders', type: 'ministerial' },
          { name: 'Teachers', type: 'ministerial' },
          // Administrative
          { name: 'Administrator', type: 'administrative' },
          { name: 'Treasurer', type: 'administrative' },
          { name: 'Financial Secretary', type: 'administrative' },
          { name: 'National Coordinator', type: 'administrative' },
          { name: 'County Coordinator', type: 'administrative' },
          { name: 'Area Coordinators', type: 'administrative' },
          { name: 'Departmental Coordinators', type: 'administrative' },
          // Functional
          { name: 'Men Department', type: 'functional' },
          { name: 'Women Department', type: 'functional' },
          { name: 'Youth Department', type: 'functional' },
          { name: 'Children Department', type: 'functional' },
        ],
      },
      growthStatistics: {
        membersCount: 250,
        branchesCount: 6,
        internationalBranchesCount: 2,
        foundedYear: 2004,
      },
      leadershipTeam: [],
    };

    // BUILDING PROJECT PAGE
    const buildingProjectPageData = {
      header: {
        title: 'Building Project',
      },
      projectOverview: {
        goal: 'Build a New Church Building',
        description:
          'The area experiences severe flooding every year. The project aims to construct a solid, lasting church building with a protective fence.',
        estimatedBudget: 215000,
        timeline: '',
      },
      reasonAndImpact: {
        text:
          'The church goes through severe flood situations every year. A new building and protective fence are needed to provide a safe place of worship.',
      },
      floodGallery: [],
      donationCallToAction: {
        title: 'We Need Your Support and Prayers',
        message:
          'It is certainly a very big and impossible project for us, but with God, all things are possible. Your prayers and support help make this vision a reality.',
      },
      projectStatus: {
        statusText: 'Believing God for provision and progress on the building project.',
        progressPercentage: 0,
      },
      biblicalReference: {
        reference: 'Matthew 19:26',
        text: 'With God all things are possible.',
      },
    };

    // GALLERY PAGE
    const galleryPageData = {
      header: {
        title: 'Gallery',
      },
      description:
        'Church history gallery showcasing the journey and growth of Victorious Faith Ministries, including development stages and celebration highlights.',
      images: [],
    };

    // ACTIVITIES PAGE
    const activitiesPageData = {
      header: {
        title: 'Church Activities',
      },
      overviewText:
        'Weekly, monthly, and yearly activities that shape the worship, discipleship, and outreach life of Victorious Faith Ministries.',
      weeklyActivities: [
        {
          title: 'Worship service and discipleship review classes',
          day: 'Sunday',
          time: '9:00 AM - 11:30 AM',
          description: '',
          displayOrder: 1,
        },
        {
          title: 'Fast and prayer services',
          day: 'Thursday',
          time: '5:00 PM - 6:15 PM',
          description: '',
          displayOrder: 2,
        },
        {
          title: 'Leadership training and prayer time',
          day: 'Saturday (1)',
          time: '7:00 AM - 2:00 PM',
          description: '',
          displayOrder: 3,
        },
        {
          title: 'Youths on Fire',
          day: 'Saturday (2)',
          time: '12:30 PM - 1:30 PM',
          description: '',
          displayOrder: 4,
        },
      ],
      monthlyActivities: [
        {
          title: 'MAXIMUM IMPACT prayer service',
          day: 'Last Day of Month',
          time: '5:00 PM - 6:15 PM',
          description: '',
          displayOrder: 1,
        },
        {
          title: 'Baptism of new converts',
          day: 'Last Saturday',
          time: '',
          description: '',
          displayOrder: 2,
        },
      ],
      yearlyActivities: [
        {
          title: 'Church Anniversary/Convention',
          day: 'April',
          time: '',
          description: '',
          displayOrder: 1,
        },
        {
          title: 'ARISE SUMMIT (Global Program)',
          day: 'November',
          time: '',
          description: '',
          displayOrder: 2,
        },
      ],
    };

    // TESTIMONIES PAGE
    const testimoniesPageData = {
      header: {
        title: 'Testimonies',
      },
      introText: 'What God is Doing in Our Midst',
      categories: [
        {
          key: 'salvation',
          name: 'Salvation',
          description:
            'Every week testimonies of salvation are received by the grace of God.',
        },
        {
          key: 'healing',
          name: 'Healing and Deliverance',
          description:
            'Every week testimonies of healing and deliverance are received by the grace of God.',
        },
        {
          key: 'family',
          name: 'Family Restoration',
          description:
            'Through the church\'s prayer ministry, many families and relationships have been restored and healed.',
        },
        {
          key: 'youth',
          name: 'Youth Ministry Impact',
          description:
            'The youth ministry has seen tremendous growth and many young people have found purpose and direction through Christ.',
        },
      ],
    };

    // CONTACT PAGE
    const contactPageData = {
      header: {
        title: 'Contact',
      },
      contactInfo: {
        address: organizationAddress,
        phone: organizationPhone,
        email: organizationEmail,
        website: organizationWebsite,
      },
      location: {
        mapEmbedCode: '',
        mapUrl: '',
      },
      socialLinks: [],
    };

    // ACADEMY PAGE
    const academyPageData = {
      header: {
        title: 'Victorious Faith Academy / Victorious Faith Refuge Home',
      },
      overviewText:
        'Victorious Faith Academy serves children from day-care to 9th grade, extending the LOVE of Christ by providing shelter, parental care, and Christian education.',
      establishmentStory: {
        text:
          'After the civil war, many children were orphans or less privileged. The Academy and Refuge Home were established to extend the LOVE of Christ and provide shelter and parental care.',
      },
      historyText:
        'The work started in a two-room small building serving about 30 children. Through partnership with World Orphans, a larger facility was provided. When government policies changed, the remaining orphans were placed in safe, godly home units and in the founders\' home alongside their four biological children.',
      programs: [
        {
          title: 'Day-care to 9th Grade Education',
          description:
            'Comprehensive Christian education for children from day-care through 9th grade.',
        },
      ],
      facilitiesGallery: [],
      enrollmentInfo: {
        text:
          'For information about enrollment at Victorious Faith Academy or Refuge Home, please contact the ministry office.',
      },
    };

    // CLINIC PAGE
    const clinicPageData = {
      header: {
        title: 'Victorious Faith Community Clinic',
      },
      overviewText:
        'Victorious Faith Community Clinic is the only health facility in Battery Factory Community, established after a tragic incident to serve the community with medical care.',
      establishmentStory: {
        text:
          'The clinic was established in 2012 after the pastor\'s son died in a car on the way to the nearest clinic at night. This painful experience motivated the founder to establish a local clinic so that others would not face the same situation.',
      },
      services: [
        {
          title: 'Community Clinic and Medical Center',
          description:
            'Registered as a medical center and the only health facility in Battery Factory Community, providing care and support to local families.',
        },
        {
          title: 'Laboratory and Basic Care Services',
          description:
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

    // REHAB PAGE
    const rehabPageData = {
      header: {
        title: 'Addict to Disciple Program',
      },
      overviewText:
        'Addict to Disciple is a discipleship-based rehabilitation program helping addicts find freedom in Christ.',
      startDate: 'January 1, 2016',
      motivationText:
        'The program was born out of observing blood-shut eyes of youth on the streets, increased crime, and make-shift ghettos in many communities.',
      trainingText:
        'The founder received training from experienced addiction specialists, including Dr. David Hinn in the USA, with a focus on effective and rigorous training on how to disciple an addict.',
      resultsText:
        'The program has seen phenomenal progress, with heart-rendering testimonies from men and women set free from addiction, focusing on evangelism and discipleship of addicts upon returning to Liberia.',
      galleryImages: [],
    };

    // ACTS FELLOWSHIP PAGE
    const actsFellowshipPageData = {
      header: {
        title: 'Acts Fellowship International',
      },
      overviewText:
        'Acts Fellowship International is a leadership training movement that began in 2013 during a leadership conference in Liberia.',
      foundedYear: 2013,
      visionText:
        'The vision is to reach out to leaders without formal pastoral or theological training, focusing on those teaching and preaching the word of God in challenged parts of the region.',
      partnershipsText:
        'Acts Fellowship was birthed through partnership with Pastor Bob and Dr. Dan, along with Bishop Andrew Gombay, to train church leaders and strengthen healthy churches across West Africa.',
      galleries: [],
    };

    // RESOURCES PAGE
    const resourcesPageData = {
      header: {
        title: 'Acts Fellowship Resource Page',
      },
      teachingVideos: [],
      otSessions: [],
      ntSessions: [],
      dbsSessions: [],
      nurturingSessions: [],
      audioLessons: [],
    };

    // DONATE PAGE
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

    console.log('Website seed data completed.');
  } catch (err) {
    console.error('Error seeding website data:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
