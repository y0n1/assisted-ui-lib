import React from 'react';
import flatten from 'lodash/flatten';
import { MultiSelectField } from '../../../common';
import { AgentK8sResource } from '../../types';
import { MultiSelectOption } from '../../../common/components/ui/formik/types';
import { AGENT_LOCATION_LABEL_KEY, INFRAENV_AGENTINSTALL_LABEL_KEY } from '../common';

export const infraEnvLabelKeys = [INFRAENV_AGENTINSTALL_LABEL_KEY, AGENT_LOCATION_LABEL_KEY];

type LabelsSelectorProps = {
  agents: AgentK8sResource[];
  labelKeysFilter?: string[];
  name?: string;
};

const LabelsSelector: React.FC<LabelsSelectorProps> = ({
  agents,
  labelKeysFilter,
  name = 'agentLabels',
}) => {
  const agentLabelOptions = Array.from(
    new Set(
      flatten(
        agents.map((agent) =>
          Object.keys(agent.metadata?.labels || {})
            .filter((k) => !(labelKeysFilter || infraEnvLabelKeys).includes(k))
            .map((k) => `${k}=${agent.metadata?.labels?.[k]}`),
        ),
      ),
    ),
  ).map<MultiSelectOption>((value) => ({
    // Why is that bloody prop set as mandatory in the SelectOptionProps??
    isLastOptionBeforeFooter: (index: number): boolean => index === value.length,
    id: value,
    value: value,
    displayName: value,
  }));

  return (
    <MultiSelectField
      idPostfix="agentLabels"
      name={name}
      label="Labels matching hosts"
      placeholderText="app=frontend"
      helperText="Provide as many labels as you can to narrow the list to relevant hosts only."
      options={agentLabelOptions}
    />
  );
};

export default LabelsSelector;
