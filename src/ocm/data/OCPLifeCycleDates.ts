// TODO(jkilzi): Move this data to a ConfigMap or an environment variable
/**
 * Data is taken from https://access.redhat.com/support/policy/updates/openshift#dates
 *
 * Abbreviations:
 *  - ga: "General availability"
 *  - fs: "Full support"
 *  - ms: "Maintenance support"
 */
const OCPLifeCycleDates = {
  byVersions: {
    '4.10': { ga: 'March 10, 2022', fs: null, ms: 'September 10, 2023' },
    '4.9': { ga: 'October 18, 2021', fs: 'June 10, 2022', ms: 'April 18, 2023' },
    '4.8': { ga: 'July 27, 2021', fs: 'January 27, 2022', ms: 'January 27, 2023' },
    '4.7': { ga: 'February 24, 2021', fs: 'October 27, 2021', ms: 'August 24, 2022' },
    '4.6': { ga: 'October 27, 2020', fs: 'March 24, 2021', ms: 'October 27, 2022' },
  },
} as const;

export type OCPVersions = keyof typeof OCPLifeCycleDates['byVersions'];

export default OCPLifeCycleDates;
