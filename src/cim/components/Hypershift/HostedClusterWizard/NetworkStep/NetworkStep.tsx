import { Stack, StackItem, TextContent, Text } from '@patternfly/react-core';
import { Formik } from 'formik';
import noop from 'lodash/noop';
import * as Yup from 'yup';
import * as React from 'react';
import NetworkForm from './NetworkForm';
import NetworkHostsTable from './NetworkHostsTable';
import { NetworkStepProps, NetworkFormValues } from './types';
import {
  httpProxyValidationSchema,
  ipBlockValidationSchema,
  noProxyValidationSchema,
  sshPublicKeyValidationSchema,
} from '../../../../../common';

const validationSchema = Yup.lazy<NetworkFormValues>((values) =>
  Yup.object<NetworkFormValues>().shape({
    machineCIDR: Yup.string().required(),
    sshPublicKey: sshPublicKeyValidationSchema.required(),
    serviceCIDR: values.isAdvanced ? ipBlockValidationSchema : Yup.string(),
    podCIDR: values.isAdvanced ? ipBlockValidationSchema : Yup.string(),
    httpProxy: httpProxyValidationSchema(values, 'httpsProxy'),
    httpsProxy: httpProxyValidationSchema(values, 'httpProxy'), // share the schema, httpS is currently not supported
    noProxy: noProxyValidationSchema,
  }),
);

const NetworkStep: React.FC<NetworkStepProps> = ({
  agents,
  formRef,
  onValuesChanged,
  onEditHostname,
  initAdvancedNetworking,
  initSSHPublicKey = '',
}) => {
  return (
    <Formik<NetworkFormValues>
      initialValues={{
        machineCIDR: '',
        isAdvanced: initAdvancedNetworking,
        sshPublicKey: initSSHPublicKey,
        serviceCIDR: '172.31.0.0/16',
        podCIDR: '10.132.0.0/14',
        enableProxy: false,
        httpProxy: '',
        httpsProxy: '',
        noProxy: '',
      }}
      validationSchema={validationSchema}
      innerRef={formRef}
      onSubmit={noop}
    >
      <Stack hasGutter>
        <StackItem>
          <NetworkForm agents={agents} onValuesChanged={onValuesChanged} />
        </StackItem>
        <StackItem>
          <TextContent>
            <Text component="h2">Host inventory</Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <NetworkHostsTable agents={agents} onEditHostname={onEditHostname} />
        </StackItem>
      </Stack>
    </Formik>
  );
};

export default NetworkStep;
