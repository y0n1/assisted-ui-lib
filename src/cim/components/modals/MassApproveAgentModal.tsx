import * as React from 'react';
import {
  Alert,
  Button,
  ButtonVariant,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';
import { getAIHosts } from '../helpers';
import { AgentK8sResource } from '../../types';
import HostsTable from '../../../common/components/hosts/HostsTable';
import { TableRow } from '../../../common/components/hosts/AITable';
import { Host, ModalProgress } from '../../../common';
import { agentStatus } from '../helpers/agentStatus';
import { usePagination } from '../../../common/components/hosts/usePagination';
import { getErrorMessage } from '../../../common/utils';

type ApproveTableRowProps = {
  agent?: AgentK8sResource;
};

const ApproveTableRow: React.FC<ApproveTableRowProps> = ({ agent, children }) => (
  <div className={agent?.spec.approved ? 'pf-u-color-200' : undefined}>{children}</div>
);

const hostnameColumn = (agents: AgentK8sResource[]): TableRow<Host> => {
  return {
    header: {
      title: 'Hostname',
      props: {
        id: 'col-header-hostname', // ACM jest tests require id over testId
      },
      transforms: [sortable],
    },
    cell: (host) => {
      const agent = agents.find((a) => a.metadata?.uid === host.id);
      const hostname = agent?.spec.hostname || agent?.status?.inventory.hostname;
      return {
        title: <ApproveTableRow agent={agent}>{hostname}</ApproveTableRow>,
        props: { 'data-testid': 'hostname' },
        sortableValue: hostname,
      };
    },
  };
};

const statusColumn = (agents: AgentK8sResource[]): TableRow<Host> => {
  return {
    header: {
      title: 'Status',
      props: {
        id: 'col-header-status', // ACM jest tests require id over testId
      },
      transforms: [sortable],
    },
    cell: (host) => {
      const agent = agents.find((a) => a.metadata?.uid === host.id);
      const status = agent?.spec.approved ? 'Already approved' : agentStatus.discovered.title;
      const icon = agentStatus.discovered.icon;
      return {
        title: (
          <ApproveTableRow agent={agent}>
            {agent?.spec.approved ? (
              status
            ) : (
              <>
                {icon} {status}
              </>
            )}
          </ApproveTableRow>
        ),
        props: { 'data-testid': 'status' },
        sortableValue: status,
      };
    },
  };
};

type MassApproveAgentModalProps = {
  agents: AgentK8sResource[];
  onApprove: (agent: AgentK8sResource) => Promise<AgentK8sResource>;
  isOpen: boolean;
  onClose: VoidFunction;
};

const MassApproveAgentModal: React.FC<MassApproveAgentModalProps> = ({
  agents,
  onApprove,
  isOpen,
  onClose,
}) => {
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<{ title: string; message: string }>();
  const onClick = async () => {
    setError(undefined);
    let i = 0;
    try {
      for (const agent of agents) {
        if (!agent.spec.approved) {
          setProgress((100 * (i + 1)) / agents.length);
          await onApprove(agent);
        }
        i++;
      }
      setProgress(null);
      onClose();
    } catch (err) {
      setError({
        title: 'An error occured while approving agents',
        message: getErrorMessage(err),
      });
      setProgress(null);
    }
  };
  const { content, hosts } = React.useMemo(
    () => ({ content: [hostnameColumn(agents), statusColumn(agents)], hosts: getAIHosts(agents) }),
    [agents],
  );

  const paginationProps = usePagination(hosts.length);
  return (
    <Modal
      aria-label="Approve hosts dialog"
      title="Approve hosts to join infrastructure environment"
      isOpen={isOpen}
      onClose={onClose}
      hasNoBodyWrapper
      id="mass-approve-modal"
      variant="medium"
    >
      <ModalBoxBody>
        <Stack hasGutter>
          <StackItem>
            <Alert
              isInline
              variant="info"
              title="You are approving multiple hosts. All hosts listed below will be approved to join the infrastructure environment if you continue. Make sure that you expect and recognize the hosts before approving."
            />
          </StackItem>
          <StackItem>
            <HostsTable hosts={hosts} content={content} {...paginationProps}>
              <div>No hosts selected</div>
            </HostsTable>
          </StackItem>
          <StackItem>
            <ModalProgress error={error} progress={progress} />
          </StackItem>
        </Stack>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button onClick={onClick} isDisabled={progress !== null}>
          Approve all hosts
        </Button>
        <Button onClick={onClose} variant={ButtonVariant.secondary} isDisabled={progress !== null}>
          Cancel
        </Button>
      </ModalBoxFooter>
    </Modal>
  );
};

export default MassApproveAgentModal;
