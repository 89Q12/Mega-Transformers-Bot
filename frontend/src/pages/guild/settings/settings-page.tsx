import { Container, Icon } from '@chakra-ui/react';
import { OpenIntroChannel } from './components/open-intro-channel.tsx';
import { useGetSettings } from './hooks/use-get-settings.tsx';
import { Form, FormikProvider, useFormik } from 'formik';
import { Settings } from './domain/settings.tsx';
import { usePutSettings } from './hooks/use-put-settings.tsx';
import { IntroChannel } from './components/intro-channel.tsx';
import { UnverifiedMemberRole } from './components/unverified-member-role.tsx';
import { VerifiedMemberRole } from './components/verified-member-role.tsx';
import { ModRole } from './components/mod-role.tsx';
import { AdminRole } from './components/admin-role.tsx';
import {
  HiChatBubbleBottomCenterText,
  HiHashtag,
  HiOutlineEllipsisVertical,
  HiUserGroup,
} from 'react-icons/hi2';
import { Heading } from '@chakra-ui/layout';
import { ElementType, FC, PropsWithChildren, useEffect, useState } from 'react';
import { LeaveChannel } from './components/leave-channel.tsx';
import { Prefix } from './components/prefix.tsx';
import { WelcomeMessageFormat } from './components/welcome-message-format.tsx';
import { LeaveMessageFormat } from './components/leave-message-format.tsx';
import { equals } from 'rambda';
import { PageSpinner } from '../../../components/page-spinner.tsx';
import { useGetChannels } from '../../../hooks/api/use-get-channels.tsx';
import { useGetRoles } from '../../../hooks/api/use-get-roles.tsx';
import { gapChildrenVertically } from '../../../util/gap-children-vertically.tsx';

const SectionHeading: FC<PropsWithChildren<{ icon: ElementType }>> = ({
  icon,
  children,
}) => (
  <Heading size="lg">
    <Icon as={icon} marginBottom="-.13em" />
    &nbsp;{children}
  </Heading>
);

const SettingsPage = () => {
  const settings = useGetSettings();
  const postSettings = usePutSettings();
  const channels = useGetChannels();
  const roles = useGetRoles();
  const [submitting, setSubmitting] = useState(false);
  const form = useFormik<Settings>({
    initialValues: {},
    onSubmit: () => {},
  });
  useEffect(() => {
    if (form.values && settings && !equals(form.values, settings)) {
      setSubmitting(true);
      postSettings(form.values)
        .then()
        .finally(() => setSubmitting(false));
    }
    // other dependencies cause loops, and we are not interested settings changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);
  useEffect(() => {
    if (settings) {
      form.setValues(settings);
    }
    // form changes should not trigger this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  if (!settings || !channels || !roles) {
    return <PageSpinner />;
  }
  return (
    <FormikProvider value={{ ...form, isSubmitting: submitting }}>
      <Container
        as={Form}
        display="flex"
        flexDirection="column"
        css={gapChildrenVertically(6)}
      >
        <SectionHeading icon={HiHashtag}>Channels</SectionHeading>
        <OpenIntroChannel channels={channels} />
        <IntroChannel channels={channels} />
        <LeaveChannel channels={channels} />
        <SectionHeading icon={HiUserGroup}>Roles</SectionHeading>
        <UnverifiedMemberRole roles={roles} />
        <VerifiedMemberRole roles={roles} />
        <ModRole roles={roles} />
        <AdminRole roles={roles} />
        <SectionHeading icon={HiChatBubbleBottomCenterText}>
          Messages
        </SectionHeading>
        <WelcomeMessageFormat />
        <LeaveMessageFormat />
        <SectionHeading icon={HiOutlineEllipsisVertical}>Misc</SectionHeading>
        <Prefix />
      </Container>
    </FormikProvider>
  );
};

export default SettingsPage;
