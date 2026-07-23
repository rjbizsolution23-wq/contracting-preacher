// South Carolina Government Contracting Resource Vault — data layer
// Verified: July 23, 2026
//
// This file is the single source of truth for the searchable procurement
// vault at /south-carolina-contracting-resources. Every government buyer,
// bid portal, registration system, certification, and assistance program
// is modeled as a single SCResource record so the UI can search and
// filter across all of them consistently.

export type GovernmentLevel =
  | 'federal'
  | 'state'
  | 'county'
  | 'city'
  | 'school-district'
  | 'university'
  | 'transportation'
  | 'utility'
  | 'special-district'
  | 'housing-authority'
  | 'federal-installation'
  | 'certification-body'
  | 'financing'
  | 'compliance'
  | 'assistance'
  | 'platform'

export type TrustLabel =
  | 'official-government'
  | 'government-adopted-portal'
  | 'free-assistance'
  | 'commercial'
  | 'directory-only'
  | 'manual-contact'
  | 'unavailable'

export type ResourceStatus = 'active' | 'unverified' | 'unavailable'

export interface SCResource {
  id: string
  name: string
  level: GovernmentLevel
  category: string
  buyer?: string
  county?: string
  city?: string
  officialUrl?: string
  bidPortalUrl?: string
  vendorRegistrationUrl?: string
  contact?: string
  registrationRequired?: 'yes' | 'no' | 'varies' | 'n/a'
  portalProvider?: string
  certifications?: string[]
  industries?: string[]
  lastVerified: string
  status: ResourceStatus
  trust: TrustLabel
  notes?: string
  freeOrPaid?: 'free' | 'paid' | 'n/a'
  primeOrSub?: 'prime' | 'sub' | 'both' | 'n/a'
  workType?: 'construction' | 'supplies-services' | 'both' | 'n/a'
}

const VERIFIED = '2026-07-23'

// ---------------------------------------------------------------------------
// Helpers to keep the ~260 records below terse and consistent.
// ---------------------------------------------------------------------------

function make(partial: Partial<SCResource> & { id: string; name: string; level: GovernmentLevel; category: string; trust: TrustLabel }): SCResource {
  return {
    lastVerified: VERIFIED,
    status: 'active',
    registrationRequired: 'varies',
    freeOrPaid: 'free',
    primeOrSub: 'both',
    workType: 'both',
    ...partial,
  }
}

function county(
  name: string,
  officialUrl: string,
  bidPortalUrl: string,
  portalProvider: string,
  trust: TrustLabel = 'official-government',
  notes?: string,
): SCResource {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '-')
  return make({
    id: `county-${slug}`,
    name: `${name} County`,
    level: 'county',
    category: 'County Government',
    buyer: `${name} County`,
    county: name,
    officialUrl,
    bidPortalUrl,
    portalProvider,
    trust,
    notes,
  })
}

function city(
  name: string,
  officialUrl: string,
  bidPortalUrl: string,
  portalProvider: string,
  trust: TrustLabel = 'official-government',
  notes?: string,
): SCResource {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '-')
  return make({
    id: `city-${slug}`,
    name,
    level: 'city',
    category: 'Municipality',
    buyer: `City/Town of ${name}`,
    city: name,
    officialUrl,
    bidPortalUrl,
    portalProvider,
    trust,
    notes,
  })
}

// ---------------------------------------------------------------------------
// 1. Essential South Carolina contracting stack
// ---------------------------------------------------------------------------

export const ESSENTIAL_STACK: SCResource[] = [
  make({ id: 'stack-vendor-reg', name: 'SC Vendor Registration', level: 'state', category: 'Essential Stack', officialUrl: 'https://procurement.sc.gov/doing-biz/registration', portalProvider: 'SCEIS', trust: 'official-government', notes: 'State vendor number and payment eligibility.' }),
  make({ id: 'stack-scbo', name: 'SC Business Opportunities (SCBO)', level: 'state', category: 'Essential Stack', officialUrl: 'https://scbo.sc.gov/online-edition', portalProvider: 'SCBO', trust: 'official-government', notes: 'State solicitations and public notices.' }),
  make({ id: 'stack-sceis', name: 'SCEIS Central Purchasing', level: 'state', category: 'Essential Stack', officialUrl: 'https://procurement.sc.gov/doing-biz/bid-ops', portalProvider: 'SCEIS', trust: 'official-government', notes: 'State IT, supplies and services solicitations.' }),
  make({ id: 'stack-term-contracts', name: 'Statewide Term Contracts', level: 'state', category: 'Essential Stack', officialUrl: 'https://procurement.sc.gov/contracts/search', portalProvider: 'SCEIS', trust: 'official-government', notes: 'Existing statewide contracts and incumbent vendors.' }),
  make({ id: 'stack-ose', name: 'Office of State Engineer', level: 'state', category: 'Essential Stack', officialUrl: 'https://procurement.sc.gov/construction', portalProvider: 'SC Procurement', trust: 'official-government', notes: 'State construction procurement.', workType: 'construction' }),
  make({ id: 'stack-officers', name: 'State Procurement Officers Directory', level: 'state', category: 'Essential Stack', officialUrl: 'https://procurement.sc.gov/officers', portalProvider: 'SC Procurement', trust: 'official-government', notes: 'Direct agency purchasing contacts.' }),
  make({ id: 'stack-mbe', name: 'SC Minority Business Certification', level: 'certification-body', category: 'Essential Stack', officialUrl: 'https://advance.sc.gov/small-business-division', portalProvider: 'SC Commission for Minority Affairs', trust: 'official-government', notes: 'South Carolina MBE certification.' }),
  make({ id: 'stack-scdot-vendor', name: 'SCDOT Vendor Registration', level: 'transportation', category: 'Essential Stack', officialUrl: 'https://www.scdot.org/business/business-vendor-register.html', portalProvider: 'SCDOT', trust: 'official-government', notes: 'Transportation contracting registration.' }),
  make({ id: 'stack-apex', name: 'SC APEX Accelerator', level: 'assistance', category: 'Essential Stack', officialUrl: 'https://scaccelerator.org/', portalProvider: 'PTAC Network', trust: 'free-assistance', notes: 'Free government-contracting assistance.' }),
  make({ id: 'stack-sbdc', name: 'SC SBDC Government Contracting', level: 'assistance', category: 'Essential Stack', officialUrl: 'https://www.scsbdc.com/government', portalProvider: 'SC SBDC', trust: 'free-assistance', notes: 'Free counseling and business assistance.' }),
  make({ id: 'stack-sam', name: 'SAM.gov', level: 'federal', category: 'Essential Stack', officialUrl: 'https://sam.gov/', portalProvider: 'GSA', trust: 'official-government', notes: 'Federal registration and opportunities.' }),
  make({ id: 'stack-mysba', name: 'MySBA Certifications', level: 'federal', category: 'Essential Stack', officialUrl: 'https://certifications.sba.gov/', portalProvider: 'SBA', trust: 'official-government', notes: '8(a), WOSB, HUBZone and other certifications.' }),
  make({ id: 'stack-usaspending', name: 'USAspending', level: 'federal', category: 'Essential Stack', officialUrl: 'https://www.usaspending.gov/search', portalProvider: 'Treasury', trust: 'official-government', notes: 'Federal award and incumbent research.' }),
  make({ id: 'stack-sba-subs', name: 'SBA Subcontracting Directory', level: 'federal', category: 'Essential Stack', officialUrl: 'https://www.sba.gov/federal-contracting/contracting-guide/prime-subcontracting/subcontracting-opportunities', portalProvider: 'SBA', trust: 'official-government', notes: 'Prime contractors seeking small businesses.', primeOrSub: 'sub' }),
]

// ---------------------------------------------------------------------------
// 2 & 12. Federal contracting resources + certifications + SC federal installations
// ---------------------------------------------------------------------------

export const FEDERAL_RESOURCES: SCResource[] = [
  // Registration & eligibility
  make({ id: 'fed-sam', name: 'SAM.gov — Entity Registration & Opportunities', level: 'federal', category: 'Registration & Eligibility', officialUrl: 'https://sam.gov/', trust: 'official-government', notes: 'Entity registration, UEI, CAGE code, reps & certs, contract opportunities, exclusion checks, wage determinations, award research. Registration is free.' }),
  make({ id: 'fed-sb-search', name: 'SBA Small Business Search / Basic Requirements', level: 'federal', category: 'Registration & Eligibility', officialUrl: 'https://www.sba.gov/federal-contracting/contracting-guide/basic-requirements', trust: 'official-government', notes: 'Contracting officers use SBA search tools. Keep NAICS codes, capability narrative, certifications, and past performance current.' }),
  make({ id: 'fed-opportunities', name: 'SAM.gov Contract Opportunities', level: 'federal', category: 'Contract Opportunities', officialUrl: 'https://sam.gov/opportunities', trust: 'official-government', notes: 'Filter by place of performance (SC), set-aside, NAICS, deadline, department, notice type, and active status.' }),
  make({ id: 'fed-usaspending', name: 'USAspending — Award Intelligence', level: 'federal', category: 'Award Intelligence', officialUrl: 'https://www.usaspending.gov/search', trust: 'official-government', notes: 'Find incumbents, expiring contracts, agency spending patterns, and recompetes.' }),
  make({ id: 'fed-fpds', name: 'SAM.gov Award Data (FPDS)', level: 'federal', category: 'Award Intelligence', officialUrl: 'https://sam.gov/fpds', trust: 'official-government', notes: 'Federal Procurement Data System award records.' }),
  make({ id: 'fed-forecast', name: 'Agency Procurement Forecasts', level: 'federal', category: 'Award Intelligence', officialUrl: 'https://www.acquisition.gov/procurement-forecasts', trust: 'official-government', notes: 'Agency-published forecasts of upcoming procurements.' }),
  make({ id: 'fed-acq-gateway', name: 'Acquisition Gateway Forecast', level: 'federal', category: 'Award Intelligence', officialUrl: 'https://acquisitiongateway.gov/forecast', trust: 'official-government', notes: 'Cross-agency forecast tool for prime-contracting partners.' }),
  make({ id: 'fed-wage-sam', name: 'SAM.gov Wage Determinations', level: 'federal', category: 'Wage Determinations', officialUrl: 'https://sam.gov/wage-determinations', trust: 'official-government', notes: 'Construction and service-contract wage determinations.', workType: 'construction' }),
  make({ id: 'fed-wage-dbra', name: 'DOL Davis-Bacon Resources', level: 'federal', category: 'Wage Determinations', officialUrl: 'https://www.dol.gov/agencies/whd/government-contracts/prevailing-wage-resource-book/db-wage-determinations', trust: 'official-government', workType: 'construction' }),
  make({ id: 'fed-wage-sca', name: 'DOL Service Contract Act Resources', level: 'federal', category: 'Wage Determinations', officialUrl: 'https://www.dol.gov/agencies/whd/government-contracts/prevailing-wage-resource-book/sca-wage-determinations', trust: 'official-government' }),

  // Federal certifications
  make({ id: 'fed-cert-8a', name: '8(a) Business Development Program', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program', trust: 'official-government', certifications: ['8(a)'] }),
  make({ id: 'fed-cert-hubzone', name: 'HUBZone Program', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program', trust: 'official-government', certifications: ['HUBZone'] }),
  make({ id: 'fed-cert-hubzone-map', name: 'HUBZone Eligibility Map', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://maps.certify.sba.gov/hubzone/map', trust: 'official-government', certifications: ['HUBZone'] }),
  make({ id: 'fed-cert-wosb', name: 'Women-Owned Small Business (WOSB)', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/women-owned-small-business-federal-contract-program', trust: 'official-government', certifications: ['WOSB'] }),
  make({ id: 'fed-cert-edwosb', name: 'Economically Disadvantaged WOSB (EDWOSB)', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://certifications.sba.gov/', trust: 'official-government', certifications: ['EDWOSB'] }),
  make({ id: 'fed-cert-vosb', name: 'Veteran-Owned Small Business (VOSB)', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://veterans.certify.sba.gov/', trust: 'official-government', certifications: ['VOSB'] }),
  make({ id: 'fed-cert-sdvosb', name: 'Service-Disabled Veteran-Owned (SDVOSB)', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://veterans.certify.sba.gov/', trust: 'official-government', certifications: ['SDVOSB'] }),
  make({ id: 'fed-cert-sdb', name: 'Small Disadvantaged Business (SDB)', level: 'certification-body', category: 'Federal Certifications', officialUrl: 'https://www.sba.gov/federal-contracting', trust: 'official-government', certifications: ['SDB'] }),

  // SC federal installations
  make({ id: 'install-srs-sb', name: 'Savannah River Site — Small Business Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'DOE / Savannah River Site', officialUrl: 'https://public.srs.gov/partnerships/small-business-opportunities/', trust: 'official-government' }),
  make({ id: 'install-srs-proc', name: 'Savannah River Site — Procurement', level: 'federal-installation', category: 'Federal Installations', buyer: 'DOE / Savannah River Site', officialUrl: 'https://public.srs.gov/partnerships/procurement/', trust: 'official-government' }),
  make({ id: 'install-doe-srs', name: 'DOE-SRS Business Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'Department of Energy', officialUrl: 'https://www.energy.gov/srs/business-opportunities', trust: 'official-government' }),
  make({ id: 'install-srns', name: 'Savannah River Nuclear Solutions — Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'Savannah River Nuclear Solutions', officialUrl: 'https://savannahrivernuclearsolutions.com/opportunities/', trust: 'commercial', notes: 'Site management contractor, not a government agency directly.' }),
  make({ id: 'install-jbc-628', name: 'Joint Base Charleston — 628th Contracting Squadron', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Air Force / Joint Base Charleston', officialUrl: 'https://www.jbcharleston.jb.mil/About-Us/Fact-Sheets/Article/233012/628th-contracting-squadron/', trust: 'official-government' }),
  make({ id: 'install-jbc-sam', name: 'Joint Base Charleston — SAM.gov Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Air Force / Joint Base Charleston', officialUrl: 'https://sam.gov/opportunities', trust: 'official-government' }),
  make({ id: 'install-jackson-micc', name: 'Fort Jackson — Army Mission and Installation Contracting Command', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Army / Fort Jackson', officialUrl: 'https://www.army.mil/micc', trust: 'official-government' }),
  make({ id: 'install-jackson-osbp', name: 'Fort Jackson — Army Office of Small Business Programs', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Army', officialUrl: 'https://www.army.mil/osbp', trust: 'official-government' }),
  make({ id: 'install-jackson-sam', name: 'Fort Jackson — SAM.gov Search', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Army / Fort Jackson', officialUrl: 'https://sam.gov/opportunities', trust: 'official-government' }),
  make({ id: 'install-shaw-osb', name: 'Shaw AFB — Air Force Office of Small Business', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Air Force / Shaw AFB', officialUrl: 'https://www.airforcesmallbiz.af.mil/', trust: 'official-government' }),
  make({ id: 'install-shaw-sam', name: 'Shaw AFB — SAM.gov Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Air Force / Shaw AFB', officialUrl: 'https://sam.gov/opportunities', trust: 'official-government' }),
  make({ id: 'install-mcrd-smallbiz', name: 'MCRD Parris Island / MCAS Beaufort — Marine Corps Small Business Programs', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Marine Corps', officialUrl: 'https://www.iandl.marines.mil/Divisions/Small-Business-Programs-LK/', trust: 'official-government' }),
  make({ id: 'install-navy-smallbiz', name: 'Department of the Navy Small Business', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Navy / Marine Corps', officialUrl: 'https://www.secnav.navy.mil/smallbusiness/', trust: 'official-government' }),
  make({ id: 'install-mcrd-sam', name: 'MCRD / MCAS Beaufort — SAM.gov Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Marine Corps', officialUrl: 'https://sam.gov/opportunities', trust: 'official-government' }),
  make({ id: 'install-usace-charleston', name: 'USACE Charleston District — Contracting Opportunities', level: 'federal-installation', category: 'Federal Installations', buyer: 'U.S. Army Corps of Engineers', officialUrl: 'https://www.sac.usace.army.mil/Business-With-Us/Contracting-Opportunities/', trust: 'official-government', workType: 'construction' }),
]

// ---------------------------------------------------------------------------
// 4. South Carolina statewide procurement
// ---------------------------------------------------------------------------

export const STATE_RESOURCES: SCResource[] = [
  make({ id: 'state-vendor-reg', name: 'SC Vendor Registration', level: 'state', category: 'Vendor Registration', officialUrl: 'https://procurement.sc.gov/doing-biz/registration', trust: 'official-government', notes: 'Vendors generally register to submit state offers and receive payment.' }),
  make({ id: 'state-new-vendor', name: 'New Vendor Information', level: 'state', category: 'Vendor Registration', officialUrl: 'https://procurement.sc.gov/doing-biz/new-vendor', trust: 'official-government' }),
  make({ id: 'state-vendor-search', name: 'Vendor Search', level: 'state', category: 'Vendor Registration', officialUrl: 'https://procurement.sc.gov/doing-biz/registration', trust: 'official-government' }),
  make({ id: 'state-vendor-payment', name: 'State Vendor Payment Search', level: 'state', category: 'Vendor Registration', officialUrl: 'https://applications.sc.gov/STOVendorInquiry/Vendor/Search', trust: 'official-government' }),
  make({ id: 'state-scbo', name: 'South Carolina Business Opportunities (SCBO)', level: 'state', category: 'Solicitations', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'official-government', notes: 'Advertises supplies, services, IT, construction, professional services, agencies, colleges and participating local entities.' }),
  make({ id: 'state-term-contracts', name: 'Statewide Term Contracts Search', level: 'state', category: 'Solicitations', officialUrl: 'https://procurement.sc.gov/contracts/search', trust: 'official-government' }),
  make({ id: 'state-construction-ose', name: 'Office of State Engineer — Construction', level: 'state', category: 'Construction', officialUrl: 'https://procurement.sc.gov/construction', trust: 'official-government', workType: 'construction' }),
  make({ id: 'state-construction-prt', name: 'SC Parks, Recreation and Tourism — Construction Bids', level: 'state', category: 'Construction', officialUrl: 'https://www.scprt.com/about/procurement-opportunities/construction-bids', trust: 'official-government', workType: 'construction' }),
  make({ id: 'state-construction-aero', name: 'SC Aeronautics — Bid Tabulations', level: 'state', category: 'Construction', officialUrl: 'https://aeronautics.sc.gov/airport-development/sc-airport-capital-project-bid-tabulations', trust: 'official-government', workType: 'construction' }),
  make({ id: 'state-legal', name: 'SC Procurement Legal Information', level: 'state', category: 'Procurement Law & Protests', officialUrl: 'https://procurement.sc.gov/legal/general-info', trust: 'official-government', notes: 'Solicitation and award protests have strict filing requirements. Not legal advice.' }),
  make({ id: 'state-code', name: 'SC Consolidated Procurement Code', level: 'state', category: 'Procurement Law & Protests', officialUrl: 'https://procurement.sc.gov/', trust: 'official-government' }),
  make({ id: 'state-decisions', name: 'State Procurement Decisions', level: 'state', category: 'Procurement Law & Protests', officialUrl: 'https://procurement.sc.gov/legal', trust: 'official-government' }),
]

export const FREE_ASSISTANCE: SCResource[] = [
  make({ id: 'assist-apex', name: 'SC APEX Accelerator', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scaccelerator.org/', trust: 'free-assistance', notes: 'Registration guidance, bid matching, solicitation review, certifications, proposal guidance, subcontracting, cybersecurity readiness.' }),
  make({ id: 'assist-sbdc-gov', name: 'SC SBDC — Government Contracting Services', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://www.scsbdc.com/government', trust: 'free-assistance' }),
  make({ id: 'assist-sbdc', name: 'SC Small Business Development Centers', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://www.scsbdc.com/', trust: 'free-assistance' }),
  make({ id: 'assist-sba-sc', name: 'SBA South Carolina District Office', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://www.sba.gov/district/south-carolina', trust: 'official-government' }),
  make({ id: 'assist-score', name: 'SCORE South Carolina Chapters', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://www.score.org/sc/', trust: 'free-assistance' }),
  make({ id: 'assist-commerce', name: 'SC Department of Commerce — Business Resources', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scbizdev.sccommerce.com/resources', trust: 'official-government' }),
  make({ id: 'assist-commerce-suppliers', name: 'SC Commerce — Supplier Connections', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scbizdev.sccommerce.com/suppliers/connections-and-introductions', trust: 'official-government' }),
  make({ id: 'assist-commerce-capital', name: 'SC Commerce — Capital, Funding and Grants', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scbizdev.sccommerce.com/resources/capital-funding-grants', trust: 'official-government' }),
  make({ id: 'assist-commerce-cert', name: 'SC Commerce — Certification Resources', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scbizdev.sccommerce.com/resources/certifications', trust: 'official-government' }),
  make({ id: 'assist-scmep', name: 'South Carolina Manufacturing Extension Partnership', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://scmep.org/', trust: 'free-assistance' }),
  make({ id: 'assist-nist-scmep', name: 'NIST SCMEP Profile', level: 'assistance', category: 'Free Assistance', officialUrl: 'https://www.nist.gov/mep/centers/south-carolina-manufacturing-extension-partnership-scmep', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 5. South Carolina certifications (state + SCDOT DBE/SBE) — combined with
//    federal certifications above on the /certifications page.
// ---------------------------------------------------------------------------

export const SC_CERTIFICATIONS: SCResource[] = [
  make({ id: 'sc-cert-mbe', name: 'SC Minority Business Enterprise — Small Business Division', level: 'certification-body', category: 'SC State Certifications', officialUrl: 'https://advance.sc.gov/small-business-division', trust: 'official-government', certifications: ['SC MBE'] }),
  make({ id: 'sc-cert-mbe-apps', name: 'SC MBE — Application Resources', level: 'certification-body', category: 'SC State Certifications', officialUrl: 'https://advance.sc.gov/small-business-applications', trust: 'official-government', certifications: ['SC MBE'] }),
  make({ id: 'sc-cert-mbe-directory', name: 'SC MBE — Certified Business Directory & Agency Reports', level: 'certification-body', category: 'SC State Certifications', officialUrl: 'https://advance.sc.gov/small-business-division', trust: 'official-government', certifications: ['SC MBE'] }),
  make({ id: 'sc-cert-scdot-dbe', name: 'SCDOT DBE/SBE Certification', level: 'certification-body', category: 'SCDOT DBE/SBE', officialUrl: 'https://www.scdot.org/business/bus-development-dbe-sbe-cert.html', trust: 'official-government', certifications: ['DBE', 'SBE'], notes: 'For federally assisted transportation work. Not automatically interchangeable with SC MBE certification.' }),
  make({ id: 'sc-cert-scdot-directory', name: 'SCDOT DBE/SBE Directory', level: 'certification-body', category: 'SCDOT DBE/SBE', officialUrl: 'https://dbesearch.apps.scdot.org/', trust: 'official-government', certifications: ['DBE', 'SBE'] }),
  make({ id: 'sc-cert-scdot-sub', name: 'Become an SCDOT Subcontractor', level: 'certification-body', category: 'SCDOT DBE/SBE', officialUrl: 'https://www.scdot.org/business/business-subcontractor.html', trust: 'official-government', primeOrSub: 'sub' }),
  make({ id: 'sc-cert-scdot-prequal', name: 'SCDOT Prime Contractor Prequalification', level: 'certification-body', category: 'SCDOT DBE/SBE', officialUrl: 'https://www.scdot.org/business/contractor-prequalified.html', trust: 'official-government', primeOrSub: 'prime' }),
]

// ---------------------------------------------------------------------------
// 6. All 46 South Carolina counties
// ---------------------------------------------------------------------------

export const COUNTIES: SCResource[] = [
  county('Abbeville', 'https://abbevillecountysc.com/business/', 'https://abbevillecountysc.com/business/', 'County Site (Manual)'),
  county('Aiken', 'https://www.aikencountysc.gov/259/Procurement', 'https://www.aikencountysc.gov/Bids.aspx', 'County Site (Manual)'),
  county('Allendale', 'https://www.allendalecounty.com/government/county_government/administration.php', 'https://www.allendalecounty.com/i_want_to/download_view.php', 'County Site (Manual)', 'manual-contact', 'RFP documents posted manually; no dedicated bid portal identified.'),
  county('Anderson', 'https://www.andersoncountysc.org/work-live/for-businesses/purchasing/', 'https://www.andersoncountysc.org/work-live/for-businesses/purchasing/', 'County Site (Manual)'),
  county('Bamberg', 'https://bambergcounty.sc.gov/projects-and-bids', 'https://bambergcounty.sc.gov/projects-and-bids', 'County Site (Manual)'),
  county('Barnwell', 'https://www.barnwellcountysc.us/Bids.aspx', 'https://www.barnwellcountysc.us/Bids.aspx', 'CivicPlus (Manual)'),
  county('Beaufort', 'https://www.beaufortcountysc.gov/purchasing/index.html', 'https://www.beaufortcountysc.gov/purchasing/current-bids.html', 'County Site (Manual)'),
  county('Berkeley', 'https://berkeleycountysc.gov/dept/procurement/', 'https://proposals.berkeleycountysc.gov/', 'Bonfire (adopted)', 'government-adopted-portal'),
  county('Calhoun', 'https://calhouncounty.sc.gov/procurement', 'https://calhouncounty.sc.gov/procurement', 'County Site (Manual)'),
  county('Charleston', 'https://www.charlestoncounty.gov/departments/procurement/', 'https://charlestoncounty.bonfirehub.com/portal/?tab=openOpportunities', 'Bonfire (adopted)', 'government-adopted-portal'),
  county('Cherokee', 'https://cherokeecountysc.gov/finance-purchasing/', 'https://cherokeecountysc.gov/finance-purchasing/bid-packages-results/', 'County Site (Manual)'),
  county('Chester', 'https://chestercountysc.gov/departments/tax-and-finance-departments/purchasing/', 'https://www.beaconbid.com/solicitations/chester-county', 'BeaconBid (adopted)', 'government-adopted-portal'),
  county('Chesterfield', 'https://www.chesterfieldcountysc.com/invitation-for-bid-rfp-listings', 'https://www.chesterfieldcountysc.com/invitation-for-bid-rfp-listings', 'County Site (Manual)'),
  county('Clarendon', 'https://clarendoncountyprocurement.sc.gov/', 'https://clarendoncountyprocurement.sc.gov/', 'County Procurement Portal (Manual)'),
  county('Colleton', 'https://www.colletoncounty.org/purchasing', 'https://www.colletoncounty.org/bids-proposal-requests', 'County Site (Manual)'),
  county('Darlington', 'http://www.darcosc.com/departments/purchasing/index.php', 'https://www.bidnetdirect.com/south-carolina/darlingtoncounty', 'BidNet Direct (adopted)', 'government-adopted-portal'),
  county('Dillon', 'https://www.dilloncountysc.org/departments/finance_taxes/finance.php', 'https://www.dilloncountysc.org/departments/finance_taxes/finance.php', 'County Site (Manual)', 'manual-contact', 'See "How To Do Business With Dillon County Government" PDF guide.'),
  county('Dorchester', 'https://www.dorchestercountysc.gov/government/business-services/purchasing-services', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=e18973c1-4a13-4b63-a74f-feebcba670c0', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  county('Edgefield', 'https://edgefieldcounty.sc.gov/rfps-and-proposals/', 'https://edgefieldcounty.sc.gov/rfps-and-proposals/', 'County Site (Manual)'),
  county('Fairfield', 'https://www.fairfieldsc.com/departments/purchasing/', 'https://www.fairfieldsc.com/departments/purchasing/rfp-bids', 'County Site (Manual)'),
  county('Florence', 'https://www.florenceco.org/contact.php', 'https://www.bidnetdirect.com/south-carolina/florencecounty', 'BidNet Direct (adopted)', 'government-adopted-portal'),
  county('Georgetown', 'https://www.gtcounty.org/172/Purchasing', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=80b55190-4fef-4799-912d-3459328cf6f3', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  county('Greenville', 'https://www.greenvillecounty.org/Procurement/', 'https://procurement.opengov.com/portal/greenvillecounty?status=all', 'OpenGov (adopted)', 'government-adopted-portal'),
  county('Greenwood', 'https://www.greenwoodcounty-sc.gov/purchasing', 'https://www.greenwoodcounty-sc.gov/rfp', 'County Site (Manual)'),
  county('Hampton', 'http://www.hamptoncountysc.org/index.aspx?nid=22', 'http://sc-hamptoncounty2.civicplus.com/Bids.aspx?CatID=9', 'CivicPlus (Manual)'),
  county('Horry', 'https://www.horrycountysc.gov/online-services/bidrfp-packages/', 'https://www.bidnetdirect.com/south-carolina/horrycounty', 'BidNet Direct (adopted)', 'government-adopted-portal'),
  county('Jasper', 'https://www.jaspercountysc.gov/services/bids-and-solicitations/', 'https://www.jaspercountysc.gov/services/bids-and-solicitations/', 'County Site (Manual)'),
  county('Kershaw', 'https://www.kershaw.sc.gov/government/departments-h-q/purchasing', 'https://www.kershaw.sc.gov/government/departments-h-q/purchasing/bids-rfps', 'County Site (Manual)'),
  county('Lancaster', 'https://www.lancastercountysc.gov/382/Procurement', 'https://www.lancastercountysc.gov/391/Open-Solicitations', 'County Site (Manual)'),
  county('Laurens', 'https://www.laurenscountysc.gov/departments/purchasing/index.php', 'https://www.laurenscountysc.gov/departments/purchasing/bids_results.php', 'County Site (Manual)'),
  county('Lee', 'https://scbo.sc.gov/online-edition', 'https://scbo.sc.gov/online-edition', 'None identified — monitor SCBO', 'unavailable', 'No centralized county procurement portal was located. Monitor SCBO and county administrative notices.'),
  county('Lexington', 'https://lex-co.sc.gov/departments/procurement-department', 'https://lexingtoncounty.ionwave.net/Login.aspx', 'IonWave (adopted)', 'government-adopted-portal'),
  county('Marion', 'https://www.marionsc.org/departments/bids_online/index.php', 'https://www.marionsc.org/departments/bids_online/index.php', 'County Site (Manual)'),
  county('Marlboro', 'https://marlborocounty.sc.gov/services/bid_and_proposal_solicitation.php', 'https://marlborocounty.sc.gov/services/bid_and_proposal_solicitation.php', 'County Site (Manual)'),
  county('McCormick', 'https://mccormickcountysc.org/departments/finance.php', 'https://mccormickcountysc.org/how_do_i/rfp_rfq_request.php', 'County Site (Manual)'),
  county('Newberry', 'https://www.newberrycounty.gov/departments/purchasing', 'https://www.newberrycounty.gov/departments/purchasing/solicitations', 'County Site (Manual)'),
  county('Oconee', 'https://oconeesc.com/procurement-home', 'https://oconeesc.com/procurement-home', 'County Site (Manual)'),
  county('Orangeburg', 'https://www.orangeburgcounty.org/244/Procurement', 'https://www.orangeburgcounty.org/Bids.aspx', 'County Site (Manual)'),
  county('Pickens', 'https://www.co.pickens.sc.us/departments/purchasing/index.php', 'https://selfservice.pickenscountysc.us/vss/Vendors/VBids/Default.aspx', 'PeopleSoft VSS (adopted)', 'government-adopted-portal'),
  county('Richland', 'https://www.richlandcountysc.gov/Property-Business/Purchasing', 'https://procurement.opengov.com/portal/richlandcountysc', 'OpenGov (adopted)', 'government-adopted-portal'),
  county('Saluda', 'https://saludacounty.sc.gov/county-council/county-administration', 'https://saludacounty.sc.gov/services/bids-and-awards', 'County Site (Manual)'),
  county('Spartanburg', 'https://www.spartanburgcounty.gov/159/Purchasing', 'https://www.spartanburgcounty.gov/Bids.aspx', 'County Site (Manual)'),
  county('Sumter', 'https://www.sumtercountysc.gov/departments/j_-_r/purchasing/index.php', 'https://www.sumtercountysc.gov/departments/j_-_r/purchasing/open_solicitations_and_bid_opportunities.php', 'County Site (Manual)'),
  county('Union', 'https://gearupunionsc.com/procurement/', 'https://gearupunionsc.com/procurement/', 'County Site (Manual)'),
  county('Williamsburg', 'https://www.williamsburgcounty.sc.gov/319/Finance-Administration', 'https://www.williamsburgcounty.sc.gov/Bids.aspx', 'County Site (Manual)'),
  county('York', 'https://www.yorkcountygov.com/217/Purchasing', 'https://www.yorkcountygov.com/437/Active-Bids', 'County Site (Manual)'),
]

export const COUNTY_DIRECTORY = make({
  id: 'county-master-directory',
  name: 'South Carolina Association of Counties — County Directory',
  level: 'county',
  category: 'County Government',
  officialUrl: 'https://www.sccounties.org/county-information/county-directory-pages',
  trust: 'directory-only',
  notes: 'Statewide master directory for all 46 county governments.',
})

// ---------------------------------------------------------------------------
// 7. Cities and towns (South Carolina has 271 incorporated municipalities;
//    the records below are the municipalities with identified bid pages
//    plus the statewide directories for everything else).
// ---------------------------------------------------------------------------

export const CITIES: SCResource[] = [
  city('Abbeville', 'http://www.abbevillecitysc.com/151/City-Managers-Office', 'http://www.abbevillecitysc.com/bids.aspx', 'City Site (Manual)'),
  city('Aiken', 'https://www.cityofaikensc.gov/doing-business-with-the-city/', 'https://edoc.cityofaikensc.gov/weblink/0/fol/131654/Row1.aspx', 'Laserfiche WebLink (Manual)'),
  city('Anderson', 'https://www.cityofandersonsc.com/finance/', 'https://www.cityofandersonsc.com/requests/', 'City Site (Manual)'),
  city('Beaufort', 'https://sc-beaufort.civicplus.com/165/Procurement', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=cf550e69-68e2-464b-98d0-0af6e4850bd2', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  city('Bennettsville', 'http://www.bennettsvillesc.com/index.php?c=cityservices&s=purchasing', 'http://www.bennettsvillesc.com/index.php?c=cityservices&s=purchasing', 'City Site (Manual)'),
  city('Blacksburg', 'https://townofblacksburgsc.com/procurement/', 'https://townofblacksburgsc.com/procurement/', 'Town Site (Manual)'),
  city('Bluffton', 'https://www.townofbluffton.sc.gov/248/Purchasing-Center', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=cd067191-8742-412f-a4dd-f56456474808', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  city('Blythewood', 'http://www.townofblythewoodsc.gov/bid_opportunities.php', 'http://www.townofblythewoodsc.gov/bid_opportunities.php', 'Town Site (Manual)'),
  city('Bowman', 'https://townofbowman.sc.gov/index.php/employment-opportunities-bids', 'https://townofbowman.sc.gov/index.php/employment-opportunities-bids', 'Town Site (Manual)'),
  city('Charleston', 'http://www.charleston-sc.gov/index.aspx?NID=131', 'http://www.charleston-sc.gov/Bids.aspx?CatID=17', 'City Site (Manual)', 'official-government', 'Separate bid pages for capital projects (CatID=18) and general procurement (CatID=17).'),
  city('Clemson', 'https://www.clemsoncity.org/Directory.aspx?DID=13', 'https://www.clemsoncity.org/Bids.aspx', 'City Site (Manual)'),
  city('Clinton', 'https://www.cityofclintonsc.com/1214/Finance', 'https://www.cityofclintonsc.com/1471/Bid-Opportunities', 'City Site (Manual)'),
  city('Clover', 'https://www.cloversc.org/bids', 'https://www.cloversc.org/bids', 'Town Site (Manual)'),
  city('Columbia', 'https://procurement.columbiasc.gov/contact-us/', 'https://columbiasc.ionwave.net/SourcingEvents.aspx?SourceType=1', 'IonWave (adopted)', 'government-adopted-portal'),
  city('Conway', 'http://www.cityofconway.com/departments/finance/index.php', 'http://www.cityofconway.com/departments/procurement/index.php', 'City Site (Manual)'),
  city('Darlington', 'https://www.cityofdarlington.com/requests-for-proposals-bids/', 'https://www.cityofdarlington.com/requests-for-proposals-bids/', 'City Site (Manual)'),
  city('Dillon', 'https://www.cityofdillonsc.gov/contactus', 'https://www.cityofdillonsc.gov/RFPsolicitations', 'City Site (Manual)'),
  city('Easley', 'https://www.cityofeasley.com/file-directory?file-type=RFP+%2F+Bid', 'https://www.cityofeasley.com/file-directory?file-type=RFP+%2F+Bid', 'City Site (Manual)'),
  city('Edisto Beach', 'https://www.townofedistobeach.com/bids', 'https://www.townofedistobeach.com/bids', 'Town Site (Manual)'),
  city('Florence', 'https://www.cityofflorence.com/public-bid-information', 'https://www.cityofflorence.com/public-bid-information', 'City Site (Manual)'),
  city('Georgetown', 'https://www.georgetownsc.gov/governmental_services/departments/finance/bids__rfps.php', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=4a9920b8-7411-40a3-b333-0d07f00f270c', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  city('Greenville', 'https://www.greenvillesc.gov/422/Purchasing', 'https://www.greenvillesc.gov/428/Bids-Requests-For-Proposals', 'City Site (Manual)'),
  city('Greer', 'https://www.cityofgreersc.gov/page/bids-proposals', 'https://www.cityofgreersc.gov/page/bids-proposals', 'City Site (Manual)'),
  city('Hanahan', 'https://www.cityofhanahan.com/administration/page/purchasing', 'https://www.cityofhanahan.com/administration/page/bids-rfps-rfqs', 'City Site (Manual)'),
  city('Hartsville', 'https://www.hartsvillesc.gov/about-us/government/city-bid-requests', 'https://www.hartsvillesc.gov/about-us/government/city-bid-requests', 'City Site (Manual)'),
  city('Hilton Head Island', 'https://www.hiltonheadislandsc.gov/business/bids.cfm', 'https://hiltonheadislandsc.bonfirehub.com/portal/?tab=openOpportunities', 'Bonfire (adopted)', 'government-adopted-portal'),
  city('Isle of Palms', 'https://www.iop.net/finance', 'https://www.iop.net/requests-bids-proposals', 'City Site (Manual)'),
  city('Kiawah Island', 'https://www.kiawahisland.gov/departments/finance/', 'https://www.kiawahisland.gov/bid_rfq_opportunities_.php', 'Town Site (Manual)'),
  city('Lake City', 'https://lakecitysc.gov/140/Bid-Opportunities', 'https://www.lakecitysc.gov/bids.aspx', 'City Site (Manual)'),
  city('Lexington', 'https://www.lexsc.gov/176/Finance', 'https://www.lexsc.gov/Bids.aspx', 'Town Site (Manual)'),
  city('Marion', 'https://marionsc.gov/bid-opportunities/', 'https://marionsc.gov/bid-opportunities/', 'City Site (Manual)'),
  city('Mauldin', 'https://cityofmauldin.org/departments/planning-economic-development/#rfps', 'https://cityofmauldin.org/departments/planning-economic-development/#rfps', 'City Site (Manual)'),
  city('Myrtle Beach', 'https://www.cityofmyrtlebeach.com/services/bids_and_purchasing/index.php', 'https://www.cityofmyrtlebeach.com/departments/purchasing_division/current_bids_and_solicitations.php', 'City Site (Manual)'),
  city('North Augusta', 'https://www.northaugustasc.gov/business/bids-rfps/-fsiteid-1', 'https://www.northaugustasc.gov/business/bids-rfps/-fsiteid-1', 'City Site (Manual)'),
  city('North Charleston', 'https://www.northcharleston.org/business/do_business_with_north_charleston/current_bids_rfps_rfqs.php', 'https://www.northcharleston.org/business/do_business_with_north_charleston/current_bids_rfps_rfqs.php', 'City Site (Manual)'),
  city('North Myrtle Beach', 'https://www.nmb.us/208/Bids-Quotes', 'https://www.nmb.us/208/Bids-Quotes', 'City Site (Manual)'),
  city('Orangeburg', 'https://www.orangeburg.sc.us/requests-bids-proposals', 'https://www.orangeburg.sc.us/requests-bids-proposals', 'City Site (Manual)'),
  city('Pacolet', 'https://www.townofpacolet.com/contact/', 'https://www.townofpacolet.com/knowledge-base/category/bids-and-rfps-request-for-proposals-town-surplus/current-bid-opportunities-surplus/', 'Town Site (Manual)'),
  city('Pendleton', 'https://www.townofpendleton.org/Government/Public-Notices', 'https://www.townofpendleton.org/Government/Public-Notices', 'Town Site (Manual)', 'manual-contact', 'Click Project Bid and Grant Notifications, then Current Bid Notifications.'),
  city('Ridgeville', 'https://ridgevillegov.com/active-town-bids', 'https://ridgevillegov.com/active-town-bids', 'Town Site (Manual)'),
  city('Rock Hill', 'https://www.cityofrockhill.com/departments/general-services/procurement', 'https://procurement.opengov.com/portal/cityofrockhill', 'OpenGov (adopted)', 'government-adopted-portal'),
  city('Santee', 'https://www.townofsantee-sc.org/request-bids', 'https://www.townofsantee-sc.org/request-bids', 'Town Site (Manual)'),
  city('Seneca', 'https://seneca.sc.us/finance-home/bids-and-proposals', 'https://seneca.sc.us/finance-home/bids-and-proposals', 'City Site (Manual)'),
  city('Spartanburg', 'https://www.cityofspartanburg.org/295/Bid-Opportunities', 'https://vrapp.vendorregistry.com/Bids/View/BidsList?BuyerId=8616eb2f-6a27-442b-89f2-c5999b81569e', 'Vendor Registry (adopted)', 'government-adopted-portal'),
  city("Sullivan's Island", 'https://sullivansisland.sc.gov/government/current-town-projects-and-request-proposals', 'https://sullivansisland.sc.gov/government/current-town-projects-and-request-proposals', 'Town Site (Manual)'),
  city('Sumter', 'https://www.sumtersc.gov/procurement', 'https://www.sumtersc.gov/procurement/rfp-rfq', 'City Site (Manual)'),
  city('Surfside Beach', 'http://www.surfsidebeach.org/bids', 'https://www.surfsidebeach.org/Bids.aspx', 'Town Site (Manual)'),
  city('Tega Cay', 'http://www.tegacaysc.org/986/RFPs-Bids', 'http://www.tegacaysc.org/986/RFPs-Bids', 'City Site (Manual)'),
  city('Union', 'https://gearupunionsc.com/procurement/', 'https://gearupunionsc.com/procurement/', 'City Site (Manual)'),
]

export const CITY_DIRECTORIES: SCResource[] = [
  make({ id: 'city-directory-masc', name: 'Municipal Association of SC — Official Municipal Online Directory', level: 'city', category: 'Municipality', officialUrl: 'https://www.masc.sc/publications/municipal-online-directory', trust: 'directory-only', notes: 'Covers all 271 South Carolina incorporated municipalities.' }),
  make({ id: 'city-directory-sciway', name: 'SCIWAY — SC City Bid Directory', level: 'city', category: 'Municipality', officialUrl: 'https://www.sciway.net/bus/citybids.html', trust: 'directory-only' }),
  make({ id: 'city-directory-scbo', name: 'SCBO (for municipalities without a dedicated bid page)', level: 'city', category: 'Municipality', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 8. Schools, colleges and universities
// ---------------------------------------------------------------------------

export const SCHOOL_RESOURCES: SCResource[] = [
  make({ id: 'school-sde-procurement', name: 'SC Department of Education — Procurement', level: 'school-district', category: 'Statewide Education', officialUrl: 'https://ed.sc.gov/finance/procurement/procurement/', trust: 'official-government' }),
  make({ id: 'school-directory', name: 'SC School and District Directory', level: 'school-district', category: 'Statewide Education', officialUrl: 'https://ed.sc.gov/districts-schools/schools/school-directory/', trust: 'directory-only' }),
  make({ id: 'school-scbo', name: 'SCBO Education Opportunities', level: 'school-district', category: 'Statewide Education', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'official-government' }),
  make({ id: 'school-sciway-index', name: 'SCIWAY — SC School Bid Index', level: 'school-district', category: 'Statewide Education', officialUrl: 'https://www.sciway.net/bus/schoolbids.html', trust: 'directory-only' }),
  make({ id: 'school-charleston', name: 'Charleston County School District — Contracts & Procurement', level: 'school-district', category: 'Major School Districts', buyer: 'Charleston County School District', county: 'Charleston', officialUrl: 'https://www.ccsdschools.com/departments/finance/contracts-and-procurement', trust: 'official-government' }),
  make({ id: 'school-greenville', name: 'Greenville County Schools — Solicitations', level: 'school-district', category: 'Major School Districts', buyer: 'Greenville County Schools', county: 'Greenville', officialUrl: 'https://www.greenville.k12.sc.us/Departments/main.asp?titleid=solicitations', trust: 'official-government' }),
  make({ id: 'school-berkeley', name: 'Berkeley County School District — Procurement', level: 'school-district', category: 'Major School Districts', buyer: 'Berkeley County School District', county: 'Berkeley', officialUrl: 'https://www.bcsdschools.net/o/bcsd/page/procurement', trust: 'official-government' }),
  make({ id: 'school-fortmill', name: 'Fort Mill School District — Procurement', level: 'school-district', category: 'Major School Districts', buyer: 'Fort Mill School District', county: 'York', officialUrl: 'https://www.fortmillschools.org/departments/procurement', trust: 'official-government' }),
  make({ id: 'school-lee', name: 'Lee County School District — Procurements', level: 'school-district', category: 'Major School Districts', buyer: 'Lee County School District', county: 'Lee', officialUrl: 'https://www.leeschooldistrictsc.org/apps/pages/index.jsp?uREC_ID=1056970&type=d&pREC_ID=1353148', trust: 'official-government' }),
  make({ id: 'school-marion', name: 'Marion County School District — Procurement Services', level: 'school-district', category: 'Major School Districts', buyer: 'Marion County School District', county: 'Marion', officialUrl: 'https://www.marion.k12.sc.us/departments/operations/procurement-services', trust: 'official-government' }),
  make({ id: 'school-union', name: 'Union County Schools — Procurement', level: 'school-district', category: 'Major School Districts', buyer: 'Union County Schools', county: 'Union', officialUrl: 'https://www.union.k12.sc.us/page/procurement', trust: 'official-government' }),
]

export const UNIVERSITY_RESOURCES: SCResource[] = [
  make({ id: 'univ-usc', name: 'University of South Carolina — Solicitations & Awards', level: 'university', category: 'Colleges & Universities', buyer: 'University of South Carolina', officialUrl: 'https://sc.edu/about/offices_and_divisions/purchasing/solicitations_awards/', trust: 'official-government' }),
  make({ id: 'univ-usc-supplier', name: 'USC Supplier Portal', level: 'university', category: 'Colleges & Universities', buyer: 'University of South Carolina', officialUrl: 'https://supplier.ps.sc.edu/', trust: 'official-government', portalProvider: 'PeopleSoft' }),
  make({ id: 'univ-clemson', name: 'Clemson University — Procurement', level: 'university', category: 'Colleges & Universities', buyer: 'Clemson University', officialUrl: 'https://www.clemson.edu/procurement/', trust: 'official-government' }),
  make({ id: 'univ-musc', name: 'MUSC — Supplier Information', level: 'university', category: 'Colleges & Universities', buyer: 'Medical University of South Carolina', officialUrl: 'https://www.musc.edu/about/visit-us/supplier-information/university', trust: 'official-government' }),
  make({ id: 'univ-cofc', name: 'College of Charleston — Procurement', level: 'university', category: 'Colleges & Universities', buyer: 'College of Charleston', officialUrl: 'https://charleston.edu/procurement/index.php', trust: 'official-government' }),
  make({ id: 'univ-cofc-ebid', name: 'College of Charleston — eBid', level: 'university', category: 'Colleges & Universities', buyer: 'College of Charleston', officialUrl: 'https://charleston.edu/ebid/index.php', trust: 'official-government' }),
  make({ id: 'univ-scsu', name: 'South Carolina State University — Operations/Procurement', level: 'university', category: 'Colleges & Universities', buyer: 'South Carolina State University', officialUrl: 'https://scsu.edu/finance-and-operations/department_of_operations/department-of-operations.php', trust: 'official-government' }),
  make({ id: 'univ-techsystem', name: 'SC Technical College System', level: 'university', category: 'Colleges & Universities', officialUrl: 'https://www.sctechsystem.edu/', trust: 'official-government' }),
  make({ id: 'univ-scbo', name: 'SCBO (other public colleges and technical colleges)', level: 'university', category: 'Colleges & Universities', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 9. Transportation, ports and airports
// ---------------------------------------------------------------------------

export const TRANSPORTATION_RESOURCES: SCResource[] = [
  make({ id: 'transport-scdot-vendor', name: 'SCDOT — Vendor Registration', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://www.scdot.org/business/business-vendor-register.html', trust: 'official-government' }),
  make({ id: 'transport-scdot-proc', name: 'SCDOT — Procurement', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://www.scdot.org/business/procurement.html', trust: 'official-government' }),
  make({ id: 'transport-scdot-prequal', name: 'SCDOT — Prime Contractor Prequalification', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://www.scdot.org/business/contractor-prequalified.html', trust: 'official-government', primeOrSub: 'prime', workType: 'construction' }),
  make({ id: 'transport-scdot-sub', name: 'SCDOT — Subcontracting', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://www.scdot.org/business/business-subcontractor.html', trust: 'official-government', primeOrSub: 'sub' }),
  make({ id: 'transport-scdot-dbe', name: 'SCDOT — DBE/SBE Certification', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://www.scdot.org/business/bus-development-dbe-sbe-cert.html', trust: 'official-government', certifications: ['DBE', 'SBE'] }),
  make({ id: 'transport-scdot-dbe-directory', name: 'SCDOT — DBE/SBE Directory', level: 'transportation', category: 'SCDOT', buyer: 'SCDOT', officialUrl: 'https://dbesearch.apps.scdot.org/', trust: 'official-government' }),
  make({ id: 'transport-cae', name: 'Columbia Metropolitan Airport — Procurement/Bids', level: 'transportation', category: 'Airports', buyer: 'Columbia Metropolitan Airport', city: 'Columbia', officialUrl: 'https://flycae.com/procurement-bids/', trust: 'official-government' }),
  make({ id: 'transport-chs', name: 'Charleston International Airport — Procurement/RFPs', level: 'transportation', category: 'Airports', buyer: 'Charleston International Airport', city: 'Charleston', officialUrl: 'https://iflychs.com/business/procurement-rfps/', trust: 'official-government' }),
  make({ id: 'transport-aero-bids', name: 'SC Aeronautics — Airport Capital Project Bid Tabulations', level: 'transportation', category: 'Airports', officialUrl: 'https://aeronautics.sc.gov/airport-development/sc-airport-capital-project-bid-tabulations', trust: 'official-government', workType: 'construction' }),
  make({ id: 'transport-gspa', name: 'Greenville-Spartanburg International Airport', level: 'transportation', category: 'Airports', buyer: 'GSP Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices; no dedicated public bid portal identified.' }),
  make({ id: 'transport-myr', name: 'Myrtle Beach International Airport', level: 'transportation', category: 'Airports', buyer: 'Myrtle Beach International Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices.' }),
  make({ id: 'transport-flo', name: 'Florence Regional Airport', level: 'transportation', category: 'Airports', buyer: 'Florence Regional Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices.' }),
  make({ id: 'transport-hxd', name: 'Hilton Head Island Airport', level: 'transportation', category: 'Airports', buyer: 'Hilton Head Island Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices.' }),
  make({ id: 'transport-arw', name: 'Beaufort County Airport', level: 'transportation', category: 'Airports', buyer: 'Beaufort County Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices.' }),
  make({ id: 'transport-uzn', name: 'Rock Hill–York County Airport', level: 'transportation', category: 'Airports', buyer: 'Rock Hill-York County Airport', officialUrl: 'https://scbo.sc.gov/online-edition', trust: 'manual-contact', notes: 'Monitor public procurement notices.' }),
  make({ id: 'transport-ports', name: 'South Carolina Ports Authority — Procurement', level: 'transportation', category: 'Ports', buyer: 'South Carolina Ports Authority', officialUrl: 'https://scspa.com/resources/legal/procurement/', trust: 'official-government' }),
  make({ id: 'transport-coastrta', name: 'Coast RTA — Procurement', level: 'transportation', category: 'Transit', buyer: 'Coast RTA', officialUrl: 'https://coastrta.com/procurement/', trust: 'official-government' }),
  make({ id: 'transport-pdrta', name: 'Pee Dee Regional Transportation Authority — Doing Business', level: 'transportation', category: 'Transit', buyer: 'Pee Dee RTA', officialUrl: 'https://pdrta.org/doing-business-with-us/procurement', trust: 'official-government' }),
  make({ id: 'transport-carta', name: 'CARTA — Procurement', level: 'transportation', category: 'Transit', buyer: 'CARTA', officialUrl: 'https://ridecarta.com/?carta_sections=procurement', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 10. Utilities and special-purpose districts
// ---------------------------------------------------------------------------

export const UTILITY_RESOURCES: SCResource[] = [
  make({ id: 'utility-santee-cooper', name: 'Santee Cooper — Suppliers & Contractors', level: 'utility', category: 'State & Regional Utilities', buyer: 'Santee Cooper', officialUrl: 'https://www.santeecooper.com/doing-business-with-us/suppliers-contractors/', trust: 'official-government' }),
  make({ id: 'utility-greenville-water', name: 'Greenville Water — Vendor Registration', level: 'utility', category: 'State & Regional Utilities', buyer: 'Greenville Water', officialUrl: 'https://www.greenvillewater.com/about-us/doing-business-with-us', trust: 'official-government' }),
  make({ id: 'utility-charleston-water', name: 'Charleston Water System — Procurement', level: 'utility', category: 'State & Regional Utilities', buyer: 'Charleston Water System', officialUrl: 'https://www.charlestonwater.com/9/Procurement', trust: 'official-government' }),
  make({ id: 'utility-charleston-water-bids', name: 'Charleston Water System — Open Bids', level: 'utility', category: 'State & Regional Utilities', buyer: 'Charleston Water System', officialUrl: 'https://www.charlestonwater.com/172/Open-Bids', trust: 'official-government' }),
  make({ id: 'utility-gswsa', name: 'Grand Strand Water & Sewer — eProcurement', level: 'utility', category: 'State & Regional Utilities', buyer: 'Grand Strand Water & Sewer Authority', officialUrl: 'https://www.gswsa.com/Apps/eProcurement/', trust: 'official-government' }),
  make({ id: 'utility-dominion', name: 'Dominion Energy — Suppliers', level: 'utility', category: 'Private Utility Supplier Programs', buyer: 'Dominion Energy', officialUrl: 'https://www.dominionenergy.com/en/Suppliers', trust: 'commercial', notes: 'Not a government agency, but creates significant SC supplier opportunities.' }),
  make({ id: 'utility-duke', name: 'Duke Energy — Suppliers', level: 'utility', category: 'Private Utility Supplier Programs', buyer: 'Duke Energy', officialUrl: 'https://www.duke-energy.com/Partner-With-Us/Suppliers', trust: 'commercial', notes: 'Not a government agency, but creates significant SC supplier opportunities.' }),
  make({ id: 'utility-spd-sos', name: 'SC Secretary of State — Special-Purpose Districts', level: 'special-district', category: 'Special-Purpose Districts', officialUrl: 'https://sos.sc.gov/services-and-filings/municipalities/special-purpose-districts', trust: 'directory-only' }),
  make({ id: 'utility-scspd', name: 'SC Association of Special Purpose Districts — Directory', level: 'special-district', category: 'Special-Purpose Districts', officialUrl: 'https://www.scspd.com/directory', trust: 'directory-only', notes: 'Water, fire, sewer, recreation and service districts each run their own procurement process.' }),
]

// ---------------------------------------------------------------------------
// 11. Housing authorities
// ---------------------------------------------------------------------------

export const HOUSING_RESOURCES: SCResource[] = [
  make({ id: 'housing-schousing', name: 'SC Housing — Procurement Opportunities', level: 'housing-authority', category: 'Housing Authorities', buyer: 'SC State Housing Finance and Development Authority', officialUrl: 'https://schousing.sc.gov/about-sc-housing/procurement-opportunities-sc-housing', trust: 'official-government' }),
  make({ id: 'housing-columbia', name: 'Columbia Housing — Procurement', level: 'housing-authority', category: 'Housing Authorities', buyer: 'Columbia Housing', city: 'Columbia', officialUrl: 'https://www.columbiahousingsc.org/procurement', trust: 'official-government' }),
  make({ id: 'housing-florence', name: 'Florence Housing Authority — Procurement/Bids/RFPs', level: 'housing-authority', category: 'Housing Authorities', buyer: 'Florence Housing Authority', city: 'Florence', officialUrl: 'https://www.hafsc.org/procurement-bids-rfps', trust: 'official-government' }),
  make({ id: 'housing-rockhill', name: 'Rock Hill Housing Authority — Procurement', level: 'housing-authority', category: 'Housing Authorities', buyer: 'Rock Hill Housing Authority', city: 'Rock Hill', officialUrl: 'https://www.rhha.org/procurement', trust: 'official-government' }),
  make({ id: 'housing-spartanburg', name: 'Spartanburg Housing — Procurement Opportunities', level: 'housing-authority', category: 'Housing Authorities', buyer: 'Spartanburg Housing', city: 'Spartanburg', officialUrl: 'https://www.spartanburghousing.org/procurement-opportunities', trust: 'official-government' }),
  make({ id: 'housing-union', name: 'Union Housing Authority — Procurement/Bids/RFPs', level: 'housing-authority', category: 'Housing Authorities', buyer: 'Union Housing Authority', city: 'Union', officialUrl: 'https://www.unionhousingsc.org/procurement-bids-rfps', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 14. Bonding and contract financing
// ---------------------------------------------------------------------------

export const FINANCING_RESOURCES: SCResource[] = [
  make({ id: 'finance-sba-surety', name: 'SBA Surety Bond Guarantee Program', level: 'financing', category: 'Bonding', officialUrl: 'https://www.sba.gov/funding-programs/surety-bonds', trust: 'official-government', notes: 'Helps qualifying small businesses obtain bid, payment and performance bonds.' }),
  make({ id: 'finance-ssbci', name: 'SC SSBCI', level: 'financing', category: 'SC Financing', officialUrl: 'https://scjeda.com/programs/ssbci/', trust: 'official-government' }),
  make({ id: 'finance-cap', name: 'SC Capital Access Program (SC CAP)', level: 'financing', category: 'SC Financing', officialUrl: 'https://businessdevelopment.org/loans/sc-capital-access-program-sc-cap/', trust: 'free-assistance' }),
  make({ id: 'finance-commerce-loans', name: 'SC Commerce — Loan Resources', level: 'financing', category: 'SC Financing', officialUrl: 'https://scbizdev.sccommerce.com/resources/capital-funding-loans', trust: 'official-government' }),
  make({ id: 'finance-cdfi', name: 'Certified South Carolina CDFIs', level: 'financing', category: 'SC Financing', officialUrl: 'https://www.scaced.org/certified-cdcs-cdfis', trust: 'directory-only' }),
  make({ id: 'finance-sc-loan-fund', name: 'South Carolina Community Loan Fund', level: 'financing', category: 'SC Financing', officialUrl: 'https://sccommunityloanfund.org/small-business/', trust: 'free-assistance' }),
  make({ id: 'finance-communityworks', name: 'CommunityWorks — Small Business Loans', level: 'financing', category: 'SC Financing', officialUrl: 'https://communityworkscarolina.org/lending/small-business-loans/', trust: 'free-assistance' }),
]

// ---------------------------------------------------------------------------
// 15. Business compliance resources
// ---------------------------------------------------------------------------

export const COMPLIANCE_RESOURCES: SCResource[] = [
  make({ id: 'compliance-sos', name: 'SC Secretary of State — Business Entity Registration', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://businessfilings.sc.gov/', trust: 'official-government' }),
  make({ id: 'compliance-scbos', name: 'SC Business One Stop (SCBOS)', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://scbos.sc.gov/', trust: 'official-government' }),
  make({ id: 'compliance-dor', name: 'SC Department of Revenue — Business Tax Registration', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://dor.sc.gov/businesses/apply-business-tax-account', trust: 'official-government' }),
  make({ id: 'compliance-clb', name: 'SC Contractor\u2019s Licensing Board', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://llr.sc.gov/clb/', trust: 'official-government', workType: 'construction' }),
  make({ id: 'compliance-res', name: 'SC Residential Builders Commission', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://llr.sc.gov/res/', trust: 'official-government', workType: 'construction' }),
  make({ id: 'compliance-verify', name: 'SC LLR License Verification', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://verify.llronline.com/LicLookup/Contractors/Contractor.aspx?div=69', trust: 'official-government', workType: 'construction' }),
  make({ id: 'compliance-wcc', name: 'SC Workers\u2019 Compensation Commission', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://www.wcc.sc.gov/', trust: 'official-government' }),
  make({ id: 'compliance-bonds', name: 'SC State Bid, Payment and Performance Bonds Guidance', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://procurement.sc.gov/files/Bid,_Payment,_and_Performance_Bonds_091125.pdf', trust: 'official-government' }),
  make({ id: 'compliance-wage-sam', name: 'Federal Wage Determinations (SAM.gov)', level: 'compliance', category: 'Business Compliance', officialUrl: 'https://sam.gov/wage-determinations', trust: 'official-government' }),
]

// ---------------------------------------------------------------------------
// 16. Procurement platforms contractors must monitor
// ---------------------------------------------------------------------------

export interface PlatformRow {
  platform: string
  usage: string
  url?: string
}

export const PLATFORMS: PlatformRow[] = [
  { platform: 'SCEIS', usage: 'State agencies', url: 'https://procurement.sc.gov/doing-biz/bid-ops' },
  { platform: 'SCBO', usage: 'State and participating public buyers', url: 'https://scbo.sc.gov/online-edition' },
  { platform: 'OpenGov', usage: 'Greenville County, Richland County, Rock Hill', url: 'https://procurement.opengov.com/' },
  { platform: 'Bonfire', usage: 'Charleston County, Hilton Head Island', url: 'https://charlestoncounty.bonfirehub.com/portal/?tab=openOpportunities' },
  { platform: 'BidNet Direct', usage: 'Darlington, Florence, Horry, Calhoun and others', url: 'https://www.bidnetdirect.com/south-carolina' },
  { platform: 'Vendor Registry', usage: 'Beaufort, Dorchester, Georgetown, Spartanburg and others', url: 'https://vrapp.vendorregistry.com/' },
  { platform: 'IonWave', usage: 'Lexington County, Columbia', url: 'https://lexingtoncounty.ionwave.net/Login.aspx' },
  { platform: 'Public Purchase', usage: 'York County and participating school/public entities' },
  { platform: 'BeaconBid', usage: 'Chester County', url: 'https://www.beaconbid.com/solicitations/chester-county' },
  { platform: 'DemandStar', usage: 'Certain municipalities, colleges and authorities' },
  { platform: 'GovDeals', usage: 'Government surplus sales', url: 'https://www.govdeals.com/' },
  { platform: 'GSA Auctions', usage: 'Federal surplus', url: 'https://gsaauctions.gov/' },
]

// ---------------------------------------------------------------------------
// Trust label copy for the UI legend.
// ---------------------------------------------------------------------------

export const TRUST_LABELS: Record<TrustLabel, { label: string; description: string }> = {
  'official-government': { label: 'Official Government Source', description: 'Published directly by the government buyer.' },
  'government-adopted-portal': { label: 'Government-Adopted Third-Party Portal', description: 'A commercial e-procurement platform officially adopted by the buyer.' },
  'free-assistance': { label: 'Free Assistance Organization', description: 'No-cost government-contracting counseling or funding support.' },
  commercial: { label: 'Commercial Resource', description: 'A private-sector resource, not a government agency.' },
  'directory-only': { label: 'Directory Only', description: 'A master list pointing to individual buyers, not a bid portal itself.' },
  'manual-contact': { label: 'Manual-Contact Buyer', description: 'No dedicated online bid portal identified — contact the buyer directly.' },
  unavailable: { label: 'Link Currently Unavailable', description: 'No working procurement resource has been located for this buyer.' },
}

// ---------------------------------------------------------------------------
// Aggregate export used by the vault search UI.
// ---------------------------------------------------------------------------

export const ALL_RESOURCES: SCResource[] = [
  ...ESSENTIAL_STACK,
  ...FEDERAL_RESOURCES,
  ...STATE_RESOURCES,
  ...FREE_ASSISTANCE,
  ...SC_CERTIFICATIONS,
  ...COUNTIES,
  COUNTY_DIRECTORY,
  ...CITIES,
  ...CITY_DIRECTORIES,
  ...SCHOOL_RESOURCES,
  ...UNIVERSITY_RESOURCES,
  ...TRANSPORTATION_RESOURCES,
  ...UTILITY_RESOURCES,
  ...HOUSING_RESOURCES,
  ...FINANCING_RESOURCES,
  ...COMPLIANCE_RESOURCES,
]

export const RESOURCE_STATS = {
  totalResources: ALL_RESOURCES.length,
  counties: COUNTIES.length,
  cities: CITIES.length,
  federalInstallations: FEDERAL_RESOURCES.filter((r) => r.level === 'federal-installation').length,
  platforms: PLATFORMS.length,
  lastVerified: VERIFIED,
}
