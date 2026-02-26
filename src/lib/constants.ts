import type { NavLink, Service, Testimonial, FAQ, ProcessStep, Stat, BlogPost } from '@/types'

export const SITE_CONFIG = {
  name: 'The Contracting Preacher',
  tagline: 'Faith-Driven Federal Contracting Success',
  description:
    'Pastor McKnight — The Contracting Preacher — helps small businesses in South Carolina and nationwide win federal government contracts. SAM registration, bid writing, 8(a) certification, proposal preparation, and more.',
  url: 'https://thecontractingpreacher.com',
  phone: '(843) 555-0127',
  email: 'pastor@thecontractingpreacher.com',
  address: 'South Carolina',
  founder: 'Pastor McKnight',
  foundedYear: 2024,
  social: {
    facebook: 'https://facebook.com/thecontractingpreacher',
    linkedin: 'https://linkedin.com/in/pastor-mcknight',
    youtube: 'https://youtube.com/@thecontractingpreacher',
    instagram: 'https://instagram.com/thecontractingpreacher',
    tiktok: 'https://tiktok.com/@thecontractingpreacher',
  },
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'SAM.gov Registration', href: '/services/sam-registration' },
      { label: 'Bid & Proposal Writing', href: '/services/bid-proposal-writing' },
      { label: '8(a) Certification', href: '/services/8a-certification' },
      { label: 'HUBZone Certification', href: '/services/hubzone-certification' },
      { label: 'WOSB Certification', href: '/services/wosb-certification' },
      { label: 'SDVOSB Certification', href: '/services/sdvosb-certification' },
    ],
  },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICES: Service[] = [
  {
    id: 'sam-registration',
    title: 'SAM.gov Registration & Renewal',
    slug: 'sam-registration',
    shortDescription:
      'Complete System for Award Management registration so your business can bid on federal contracts and receive government payments.',
    longDescription:
      'SAM.gov registration is the mandatory first step for any business wanting to work with the federal government. Pastor McKnight handles your entire SAM registration from start to finish — obtaining your UEI number, completing your entity registration, setting up your NAICS codes, configuring your socioeconomic representations, and ensuring your profile is optimized so contracting officers can find you. We also handle annual renewals so you never lose your active status.',
    icon: 'ClipboardCheck',
    features: [
      'UEI Number acquisition and setup',
      'Complete SAM.gov entity registration',
      'NAICS code selection and optimization',
      'Core data and assertions configuration',
      'Entity validation and troubleshooting',
      'Annual renewal management',
      'Profile optimization for discoverability',
      'Representations and certifications setup',
    ],
    price: 'Starting at $497',
    popular: true,
  },
  {
    id: 'bid-proposal-writing',
    title: 'Bid & Proposal Writing',
    slug: 'bid-proposal-writing',
    shortDescription:
      'Professional government bid and proposal writing services that position your business to win federal contracts.',
    longDescription:
      'Winning federal contracts requires more than just showing up — it requires proposals that speak the government\'s language, meet every evaluation criteria, and stand out from the competition. Pastor McKnight and his team craft compelling, compliant proposals that address every requirement in the solicitation. From RFPs and RFQs to sole-source justifications, we write proposals that win.',
    icon: 'FileText',
    features: [
      'RFP and RFQ response writing',
      'Technical proposal development',
      'Past performance narratives',
      'Management approach sections',
      'Cost and pricing volume preparation',
      'Compliance matrix creation',
      'Executive summary writing',
      'Proposal review and editing',
    ],
    price: 'Starting at $1,497',
  },
  {
    id: '8a-certification',
    title: 'SBA 8(a) Certification',
    slug: '8a-certification',
    shortDescription:
      'Navigate the 8(a) Business Development Program application process and unlock sole-source and set-aside contract opportunities.',
    longDescription:
      'The SBA 8(a) Business Development Program is one of the most powerful tools for disadvantaged small businesses to access federal contracting opportunities. Pastor McKnight guides you through every step of the application — from eligibility assessment to document preparation to submission and follow-up. This 9-year program opens doors to sole-source contracts up to $4.5 million for goods and services and $7 million for manufacturing.',
    icon: 'Award',
    features: [
      'Eligibility pre-assessment',
      'Application document preparation',
      'Personal narrative statement writing',
      'Financial document organization',
      'Business plan review and enhancement',
      'SBA liaison and follow-up',
      'Annual review preparation',
      'Mentor-Protege program guidance',
    ],
    price: 'Starting at $2,497',
  },
  {
    id: 'hubzone-certification',
    title: 'HUBZone Certification',
    slug: 'hubzone-certification',
    shortDescription:
      'Qualify for the Historically Underutilized Business Zone program and access set-aside federal contract opportunities.',
    longDescription:
      'The HUBZone program helps small businesses in historically underutilized areas gain preferential access to federal procurement opportunities. The government\'s goal is to award at least 3% of all federal contract dollars to HUBZone-certified businesses. Pastor McKnight helps you determine eligibility based on your business location and employee residences, prepares your application, and manages the certification process from start to finish.',
    icon: 'MapPin',
    features: [
      'HUBZone map eligibility verification',
      'Employee residency documentation',
      'Principal office verification',
      'Application preparation and filing',
      'Supporting document compilation',
      'SBA review response management',
      'Recertification assistance',
      'Compliance monitoring',
    ],
    price: 'Starting at $1,997',
  },
  {
    id: 'wosb-certification',
    title: 'WOSB/EDWOSB Certification',
    slug: 'wosb-certification',
    shortDescription:
      'Women-Owned and Economically Disadvantaged Women-Owned Small Business certification for set-aside federal contracts.',
    longDescription:
      'The federal government has a goal of awarding at least 5% of all federal contracting dollars to women-owned small businesses. The WOSB and EDWOSB certifications qualify your business for exclusive set-aside contracts. Pastor McKnight walks you through the entire certification process, ensuring your documentation meets SBA requirements and your business is positioned to compete for these reserved opportunities.',
    icon: 'Heart',
    features: [
      'WOSB eligibility assessment',
      'EDWOSB qualification review',
      'Ownership documentation preparation',
      'Control and management verification',
      'SBA certification application',
      'Third-party certifier coordination',
      'Annual recertification support',
      'Set-aside opportunity identification',
    ],
    price: 'Starting at $1,497',
  },
  {
    id: 'sdvosb-certification',
    title: 'SDVOSB/VOSB Certification',
    slug: 'sdvosb-certification',
    shortDescription:
      'Service-Disabled Veteran-Owned and Veteran-Owned Small Business certification through the SBA.',
    longDescription:
      'The federal government is committed to awarding at least 3% of all federal contracting dollars to service-disabled veteran-owned small businesses. The SDVOSB and VOSB certifications through the SBA\'s Veterans Small Business Certification Program give veteran entrepreneurs access to sole-source and set-aside contracts. Pastor McKnight honors your service by helping you navigate the certification process with dignity and precision.',
    icon: 'Shield',
    features: [
      'Veteran status verification',
      'Service-connected disability documentation',
      'Ownership and control analysis',
      'SBA VetCert application preparation',
      'Supporting document compilation',
      'VA and SBA coordination',
      'Annual recertification',
      'Contract opportunity identification',
    ],
    price: 'Starting at $1,497',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Deacon James Williams',
    company: 'Williams Construction Services LLC',
    role: 'Owner',
    quote:
      'Pastor McKnight didn\'t just help me register on SAM.gov — he helped me understand the entire federal contracting ecosystem. Within 6 months of working with him, I won my first $350,000 government contract. His faith-based approach gave me the confidence I needed.',
    rating: 5,
    contractValue: '$350,000',
  },
  {
    id: '2',
    name: 'Patricia Simmons',
    company: 'Simmons IT Solutions',
    role: 'CEO',
    quote:
      'I was completely lost trying to get my 8(a) certification. Pastor McKnight walked me through every single step, prepared all my documents, and even helped me write my personal narrative. Approved on the first try! Now I\'m competing for set-aside contracts I never knew existed.',
    rating: 5,
    contractValue: '$1.2M',
  },
  {
    id: '3',
    name: 'Marcus & Tanya Johnson',
    company: 'J&T Janitorial Services',
    role: 'Co-Owners',
    quote:
      'We\'re a small husband-and-wife cleaning company from Charleston. Pastor McKnight helped us realize we could compete for federal facility maintenance contracts. He handled our SAM registration, wrote our first proposal, and we won a $180K annual contract with a military base. God is good!',
    rating: 5,
    contractValue: '$180,000/yr',
  },
  {
    id: '4',
    name: 'Robert Chen',
    company: 'Lowcountry Logistics LLC',
    role: 'Founder',
    quote:
      'Pastor McKnight\'s proposal writing is on another level. He understands how the government evaluates bids and knows exactly what contracting officers are looking for. We\'ve now won 4 contracts totaling over $2 million. The Contracting Preacher is the real deal.',
    rating: 5,
    contractValue: '$2M+',
  },
  {
    id: '5',
    name: 'Vanessa Thompson',
    company: 'Thompson Environmental Services',
    role: 'President',
    quote:
      'As a woman-owned small business, I qualified for WOSB set-aside contracts but didn\'t even know it. Pastor McKnight got me certified, optimized my SAM profile, and connected me to opportunities I would have missed. My first year in federal contracting brought in $750K in revenue.',
    rating: 5,
    contractValue: '$750,000',
  },
  {
    id: '6',
    name: 'Sergeant (Ret.) David Monroe',
    company: 'Monroe Security Group',
    role: 'CEO',
    quote:
      'After 20 years in the Army, I wanted to start a security company. Pastor McKnight helped me get my SDVOSB certification and navigate the VA verification process. His respect for veterans shows in everything he does. I\'m now living my dream with two active federal security contracts.',
    rating: 5,
    contractValue: '$500,000+',
  },
]

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Free Consultation',
    description:
      'Schedule a free 30-minute call with Pastor McKnight. We\'ll discuss your business, your goals, and map out a clear path to federal contracting success.',
    icon: 'Phone',
  },
  {
    step: 2,
    title: 'Strategic Assessment',
    description:
      'We evaluate your business capabilities, identify the best NAICS codes, determine which certifications you qualify for, and create your personalized federal contracting roadmap.',
    icon: 'Search',
  },
  {
    step: 3,
    title: 'Registration & Certification',
    description:
      'We handle your SAM.gov registration, prepare your certification applications, and ensure every document is accurate and complete before submission.',
    icon: 'FileCheck',
  },
  {
    step: 4,
    title: 'Opportunity Identification',
    description:
      'We identify active and upcoming federal contract opportunities that match your capabilities, location, and certifications.',
    icon: 'Target',
  },
  {
    step: 5,
    title: 'Proposal Preparation',
    description:
      'Our team writes compelling, compliant proposals that speak the government\'s language and maximize your evaluation scores.',
    icon: 'PenTool',
  },
  {
    step: 6,
    title: 'Win & Grow',
    description:
      'We support you through contract award, help with post-award compliance, and position you for future opportunities and contract growth.',
    icon: 'Trophy',
  },
]

export const STATS: Stat[] = [
  { value: '500', suffix: '+', label: 'Businesses Served' },
  { value: '89', suffix: '%', label: 'Proposal Win Rate' },
  { value: '50', prefix: '$', suffix: 'M+', label: 'Contracts Won' },
  { value: '15', suffix: '+', label: 'Years Experience' },
]

export const FAQS: FAQ[] = [
  {
    question: 'What is SAM.gov and why do I need to register?',
    answer:
      'SAM.gov (System for Award Management) is the official U.S. government system where businesses must register to bid on federal contracts, receive government payments, and be visible to contracting officers. Without an active SAM registration, your business cannot participate in any federal procurement opportunity. Registration is free on SAM.gov, but the process can be complex — which is exactly where we help.',
    category: 'Getting Started',
  },
  {
    question: 'How long does SAM.gov registration take?',
    answer:
      'The SAM.gov registration process typically takes 7-10 business days when handled correctly. However, if there are issues with your IRS TIN validation, CAGE code assignment, or entity verification, it can take significantly longer. When you work with The Contracting Preacher, we handle all aspects of your registration to minimize delays and ensure accuracy.',
    category: 'Getting Started',
  },
  {
    question: 'What is the 8(a) Business Development Program?',
    answer:
      'The 8(a) program is a 9-year business development program administered by the SBA for small businesses owned by socially and economically disadvantaged individuals. It provides access to sole-source contracts (up to $4.5M for services and $7M for manufacturing), mentoring, and federal contracting set-aside opportunities. It is one of the most powerful programs in federal contracting.',
    category: 'Certifications',
  },
  {
    question: 'Do I need to be in South Carolina to work with you?',
    answer:
      'Not at all! While Pastor McKnight is based in South Carolina and deeply connected to the local business community, we serve clients nationwide. Federal contracting is a national marketplace, and our services work the same regardless of your location. We\'ve helped businesses across all 50 states win federal contracts.',
    category: 'General',
  },
  {
    question: 'How much does it cost to get started in federal contracting?',
    answer:
      'The cost varies based on your specific needs. SAM.gov registration itself is free (beware of scam sites that charge for this!), but getting expert help ensures it\'s done correctly. Our service packages start at $497 for SAM registration assistance. Certification applications and proposal writing services have separate pricing. We always provide a clear quote during your free consultation — no hidden fees.',
    category: 'Pricing',
  },
  {
    question: 'What types of businesses can get government contracts?',
    answer:
      'Virtually every type of business can compete for federal contracts. The government buys everything — from office supplies, IT services, and janitorial services to construction, consulting, healthcare, logistics, food services, and more. There are over 1,000 NAICS codes that the government uses to classify its purchases. During your consultation, we identify which codes best match your capabilities.',
    category: 'Getting Started',
  },
  {
    question: 'What is a NAICS code and why does it matter?',
    answer:
      'NAICS (North American Industry Classification System) codes are 6-digit codes that classify businesses by industry. Every federal contract solicitation includes a NAICS code that determines which businesses can bid and what the small business size standard is. Selecting the right NAICS codes during your SAM registration is critical — it determines which contracts you\'re eligible for.',
    category: 'Getting Started',
  },
  {
    question: 'What is your proposal win rate?',
    answer:
      'Our proposal win rate is 89%, which is significantly above the industry average of 25-40%. This success comes from our disciplined approach: we only recommend bidding on contracts where you have a genuine competitive advantage, and we invest the time to craft proposals that directly address every evaluation criterion. Quality over quantity — that\'s the Contracting Preacher way.',
    category: 'Results',
  },
  {
    question: 'What is the difference between WOSB and EDWOSB?',
    answer:
      'WOSB stands for Women-Owned Small Business, requiring at least 51% ownership and control by one or more women. EDWOSB stands for Economically Disadvantaged Women-Owned Small Business, which has the same requirements plus additional criteria based on the woman owner\'s personal net worth (must be less than $750,000, excluding primary residence and business ownership). EDWOSB certification opens up additional set-aside contract opportunities.',
    category: 'Certifications',
  },
  {
    question: 'How is The Contracting Preacher different from other consultants?',
    answer:
      'Pastor McKnight brings a unique combination of deep federal contracting expertise and faith-driven values. We don\'t just process paperwork — we build relationships, educate our clients, and genuinely care about your success. Our approach is hands-on and personalized. You won\'t be treated like a number. And with an 89% proposal win rate and over $50 million in contracts won for our clients, the results speak for themselves.',
    category: 'General',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Steps to Win Your First Federal Government Contract in 2026',
    slug: '5-steps-win-first-federal-contract-2026',
    excerpt:
      'Breaking into federal contracting doesn\'t have to be overwhelming. Pastor McKnight shares the five essential steps every small business needs to take to win their first government contract this year.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-02-20',
    category: 'Getting Started',
    readTime: '8 min read',
    tags: ['federal contracting', 'small business', 'government contracts', 'SAM.gov', 'beginners guide'],
  },
  {
    id: '2',
    title: 'SAM.gov Registration Guide: Everything You Need to Know in 2026',
    slug: 'sam-gov-registration-guide-2026',
    excerpt:
      'A comprehensive guide to registering your business on SAM.gov in 2026. Learn about UEI numbers, NAICS codes, representations and certifications, and common mistakes to avoid.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-02-15',
    category: 'SAM Registration',
    readTime: '12 min read',
    tags: ['SAM.gov', 'registration', 'UEI', 'NAICS codes', 'federal contracting'],
  },
  {
    id: '3',
    title: 'How South Carolina Small Businesses Can Leverage the 8(a) Program',
    slug: 'south-carolina-small-businesses-8a-program',
    excerpt:
      'South Carolina has a vibrant small business community with tremendous potential for federal contracting. Learn how the SBA 8(a) program can open doors to lucrative government contracts.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-02-10',
    category: 'Certifications',
    readTime: '10 min read',
    tags: ['8a certification', 'South Carolina', 'small business', 'SBA', 'disadvantaged business'],
  },
  {
    id: '4',
    title: 'The Art of Writing a Winning Federal Proposal: Lessons from the Pulpit',
    slug: 'writing-winning-federal-proposal-lessons-from-pulpit',
    excerpt:
      'What do great sermons and winning proposals have in common? More than you think. Pastor McKnight draws parallels between powerful preaching and persuasive proposal writing.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-02-05',
    category: 'Proposal Writing',
    readTime: '7 min read',
    tags: ['proposal writing', 'federal contracts', 'bid writing', 'RFP response', 'winning proposals'],
  },
  {
    id: '5',
    title: 'HUBZone Certification: Is Your South Carolina Business Eligible?',
    slug: 'hubzone-certification-south-carolina-eligible',
    excerpt:
      'Many South Carolina businesses are located in Historically Underutilized Business Zones and don\'t even know it. Find out if your business qualifies for HUBZone certification.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-01-28',
    category: 'Certifications',
    readTime: '9 min read',
    tags: ['HUBZone', 'South Carolina', 'certification', 'set-aside contracts', 'small business'],
  },
  {
    id: '6',
    title: 'Top 10 NAICS Codes for Small Businesses New to Federal Contracting',
    slug: 'top-10-naics-codes-small-businesses-federal-contracting',
    excerpt:
      'Choosing the right NAICS codes is critical for your SAM registration and your ability to find and win contracts. Here are the top 10 NAICS codes that small businesses should consider.',
    content: '',
    author: 'Pastor McKnight',
    date: '2026-01-20',
    category: 'Getting Started',
    readTime: '11 min read',
    tags: ['NAICS codes', 'SAM.gov', 'small business', 'federal contracting', 'industry codes'],
  },
]
