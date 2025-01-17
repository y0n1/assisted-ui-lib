import * as React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import { AgentK8sResource } from '../../types';

type MassApproveActionProps = {
  onApprove: VoidFunction;
  selectedAgents: AgentK8sResource[];
};

const MassApproveAction: React.FC<MassApproveActionProps> = ({ onApprove, selectedAgents }) => {
  const disabledDescription = selectedAgents.every((a) => a.spec.approved)
    ? 'All selected hosts are already approved.'
    : undefined;
  return (
    <DropdownItem
      onClick={onApprove}
      isDisabled={!!disabledDescription}
      description={disabledDescription}
    >
      Approve
    </DropdownItem>
  );
};

export default MassApproveAction;
