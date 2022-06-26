import React from 'react';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import {
  global_warning_color_100 as warningColor,
  global_danger_color_100 as dangerColor,
} from '@patternfly/react-tokens';
import { OPENSHIFT_LIFE_CYCLE_DATES_LINK } from '../../config';
import { hasProp, OpenshiftVersionOptionType } from '../../types';
import { SelectField } from '../ui';
import OCPLifeCycleDates, { OCPVersions } from '../../../ocm/data/OCPLifeCycleDates';
import { diffInDaysBetweenDates } from '../../sevices/DateAndTime';

const OpenShiftLifeCycleDatesLink = () => (
  <a href={OPENSHIFT_LIFE_CYCLE_DATES_LINK} target="_blank" rel="noopener noreferrer">
    {'Learn more'} <ExternalLinkAltIcon />
  </a>
);

const getOpenshiftVersionHelperText =
  // eslint-disable-next-line react/display-name
  (versions: OpenshiftVersionOptionType[]) => (selectedVersionValue: string) => {
    if (!versions.length) {
      return (
        <>
          <ExclamationCircleIcon color={dangerColor.value} size="sm" />
          &nbsp; No release image is available.
        </>
      );
    }
    let helperTextComponent = null;
    const selectedVersion = versions.find((version) => version.value === selectedVersionValue);
    if (selectedVersion?.supportLevel !== 'production') {
      helperTextComponent = (
        <>
          <ExclamationTriangleIcon color={warningColor.value} size="sm" />
          &nbsp;Please note that this version is not production ready.{' '}
          <OpenShiftLifeCycleDatesLink />
        </>
      );
    } else if (hasProp(OCPLifeCycleDates.byVersions, selectedVersionValue)) {
      const maintenanceSupportDate =
        OCPLifeCycleDates.byVersions[selectedVersionValue as OCPVersions].ms;
      if (diffInDaysBetweenDates(maintenanceSupportDate) > 30) {
        helperTextComponent = null;
      }
      helperTextComponent = (
        <>
          <ExclamationTriangleIcon color={warningColor.value} size="sm" />
          &nbsp;
          {`Full support for this version ends on ${maintenanceSupportDate} and won't be available as an installation option afterwards.`}
          &nbsp;
          <OpenShiftLifeCycleDatesLink />
        </>
      );
    }
    return helperTextComponent;
  };

type OpenShiftVersionSelectProps = {
  versions: OpenshiftVersionOptionType[];
};
const OpenShiftVersionSelect: React.FC<OpenShiftVersionSelectProps> = ({ versions }) => {
  const selectOptions = React.useMemo(
    () =>
      versions
        .filter((version) => version.supportLevel !== 'maintenance')
        .map((version) => ({
          label: version.label,
          value: version.value,
        })),
    [versions],
  );

  return (
    <SelectField
      label="OpenShift version"
      name="openshiftVersion"
      options={selectOptions}
      getHelperText={getOpenshiftVersionHelperText(versions)}
      isDisabled={versions.length === 0}
      isRequired
    />
  );
};

export default OpenShiftVersionSelect;
