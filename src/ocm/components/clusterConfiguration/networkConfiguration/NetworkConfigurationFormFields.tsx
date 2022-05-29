import React from 'react';
import { Grid } from '@patternfly/react-core';
import NetworkConfiguration, { NetworkConfigurationProps } from './NetworkConfiguration';
import { InfraEnv } from '@openshift-assisted-ui/assisted-service-types';
import { SecurityFields } from '../../../../common/components';

type NetworkConfigurationFormFieldsProps = NetworkConfigurationProps & {
  infraEnv?: InfraEnv;
};

const NetworkConfigurationFormFields: React.FC<NetworkConfigurationFormFieldsProps> = (props) => (
  <Grid hasGutter>
    <NetworkConfiguration {...props} />
    <SecurityFields
      clusterSshKey={props.cluster.sshPublicKey}
      imageSshKey={props.infraEnv?.sshAuthorizedKey}
    />
  </Grid>
);
export default NetworkConfigurationFormFields;
