import { useGetChannels } from './hooks/use-get-channels.tsx';
import { PageSpinner } from '../../components/page-spinner.tsx';
import { Container, Icon } from '@chakra-ui/react';
import { OpenIntroChannel } from './components/open-intro-channel.tsx';
import { useGetSettings } from './hooks/use-get-settings.tsx';
import { Form, Formik } from 'formik';
import { Settings } from './domain/settings.tsx';
import { usePostSettings } from './hooks/use-post-settings.tsx';
import { IntroChannel } from './components/intro-channel.tsx';
import { useGetRoles } from './hooks/use-get-roles.tsx';
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
import { ElementType, FC, PropsWithChildren } from 'react';
import { LeaveChannel } from './components/leave-channel.tsx';
import { Prefix } from './components/prefix.tsx';
import { WelcomeMessageFormat } from './components/welcome-message-format.tsx';
import { LeaveMessageFormat } from './components/leave-message-format.tsx';

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
  const postSettings = usePostSettings();
  const channels = useGetChannels();
  const roles = useGetRoles();
  const submit = async (settings: Settings) => {
    postSettings(settings).then();
  };
  if (!settings || !channels || !roles) {
    return <PageSpinner />;
  }
  return (
    <Formik<Settings> initialValues={settings} onSubmit={submit}>
      <Container as={Form} display="flex" flexDirection="column" gap={6}>
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
    </Formik>
  );
};

export default SettingsPage;
