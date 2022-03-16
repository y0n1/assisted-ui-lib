import { useFormikContext } from 'formik';
import * as React from 'react';
import { Alert, Stack, StackItem } from '@patternfly/react-core';
import {
  ClusterDetailsFormFields,
  ClusterDetailsFormFieldsProps,
  ClusterDetailsValues,
} from '../../../common';
import { AgentClusterInstallK8sResource, ClusterDeploymentK8sResource } from '../../types';
import { ClusterImageSetK8sResource } from '../../types/k8s/cluster-image-set';
import { getOCPVersions, getSelectedVersion } from '../helpers';

type ClusterDeploymentDetailsFormProps = {
  clusterImages: ClusterImageSetK8sResource[];
  clusterDeployment?: ClusterDeploymentK8sResource;
  agentClusterInstall?: AgentClusterInstallK8sResource;
  toggleRedHatDnsService?: (checked: boolean) => void;
  onValuesChanged?: (values: ClusterDetailsValues, initRender: boolean) => void;
  pullSecret?: string;
  extensionAfter?: ClusterDetailsFormFieldsProps['extensionAfter'];
};

const ClusterDeploymentDetailsForm: React.FC<ClusterDeploymentDetailsFormProps> = ({
  agentClusterInstall,
  clusterDeployment,
  clusterImages,
  toggleRedHatDnsService,
  onValuesChanged,
  pullSecret,
  extensionAfter,
}) => {
  const { values } = useFormikContext<ClusterDetailsValues>();
  const initRenderRef = React.useRef(true);
  React.useEffect(() => onValuesChanged?.(values, initRenderRef.current), [
    onValuesChanged,
    values,
  ]);
  React.useEffect(() => {
    initRenderRef.current = false;
  }, []);
  const ocpVersions = React.useMemo(() => getOCPVersions(clusterImages), [clusterImages]);
  const forceOpenshiftVersion = agentClusterInstall
    ? getSelectedVersion(clusterImages, agentClusterInstall)
    : undefined;
  const isEditFlow = !!clusterDeployment;
  return (
    <Stack hasGutter>
      {isEditFlow && (
        <StackItem>
          <Alert
            isInline
            variant="info"
            title="This option is not editable after the draft cluster was created."
          />
        </StackItem>
      )}
      <StackItem>
        <ClusterDetailsFormFields
          toggleRedHatDnsService={toggleRedHatDnsService}
          versions={ocpVersions}
          canEditPullSecret={!clusterDeployment}
          isPullSecretSet={!!clusterDeployment?.spec?.pullSecretRef?.name}
          // isSNOGroupDisabled={!!clusterDeployment /* truish for create flow only */}
          isNameDisabled={isEditFlow}
          isBaseDnsDomainDisabled={isEditFlow}
          forceOpenshiftVersion={forceOpenshiftVersion}
          isOcm={false}
          defaultPullSecret={pullSecret}
          extensionAfter={extensionAfter}
        />
      </StackItem>
    </Stack>
  );
};

export default ClusterDeploymentDetailsForm;
