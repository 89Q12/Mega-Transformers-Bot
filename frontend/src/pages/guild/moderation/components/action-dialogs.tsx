import { FC, ReactNode, useCallback, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Text,
  useToast,
} from '@chakra-ui/react';
import { DiscordGuildMember } from '../../../../hooks/api/moderation/use-fetch-moderation-users.tsx';
import {
  HiCheck,
  HiClock,
  HiMegaphone,
  HiUserMinus,
  HiXMark,
} from 'react-icons/hi2';
import {
  gapChildrenHorizontally,
  gapChildrenVertically,
} from '../../../../util/gap-children.tsx';
import { useModerationActions } from '../hooks/use-moderation-actions.tsx';
import { SelectMember } from './select-member.tsx';
import { withProps } from '../../../../components/with-props.tsx';
import { TimeoutDurationField } from './timeout-duration-field.tsx';

type ActionDialogProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  header: ReactNode;
  label: ReactNode;
  hint?: ReactNode;
  onConfirm: (member: DiscordGuildMember, additional: T) => Promise<void>;
  confirmText: ReactNode;
  toastMessage?: (member: DiscordGuildMember) => ReactNode;
  members: DiscordGuildMember[];
  additonalValueField?: FC<{
    value: T | null;
    valueChange: (value: T | null) => void;
  }>;
};

function ActionDialog<T = null>({
  onClose,
  onConfirm,
  toastMessage,
  additonalValueField,
  ...props
}: ActionDialogProps<T>) {
  const [member, setMember] = useState<DiscordGuildMember | null>(null);
  const [additionalValue, setAdditionalValue] = useState<T | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();
  const AdditionalValueField = additonalValueField;

  const confirmClick = useCallback(() => {
    if (!member || (additonalValueField && !additionalValue)) return;
    onConfirm(member, additionalValue!)
      .then(() => {
        if (toastMessage)
          toast({ status: 'success', title: toastMessage(member) });
      })
      .then(() => {
        if (toastMessage) onClose();
      });
  }, [
    member,
    onClose,
    onConfirm,
    toastMessage,
    toast,
    additionalValue,
    additonalValueField,
  ]);
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={props.isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{props.header}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody css={gapChildrenVertically()}>
          <FormControl>
            <FormLabel>{props.label}</FormLabel>
            <SelectMember
              value={member}
              onSelected={setMember}
              members={props.members}
            />
          </FormControl>
          {AdditionalValueField && (
            <AdditionalValueField
              value={additionalValue}
              valueChange={setAdditionalValue}
            />
          )}
          {props.hint && <div>{props.hint}</div>}
        </AlertDialogBody>
        <AlertDialogFooter css={gapChildrenHorizontally()}>
          <Button
            ref={cancelRef}
            onClick={onClose}
            leftIcon={<Icon as={HiXMark} />}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmClick}
            leftIcon={<Icon as={HiCheck} />}
            isDisabled={!member || (additonalValueField && !additionalValue)}
          >
            {props.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const TimeoutDialog = withProps(ActionDialog<number>)({
  label: 'Member to timeout',
  header: (
    <>
      <Icon as={HiClock} /> Timeout
    </>
  ),
  confirmText: 'Timeout',
  toastMessage: (user) => `${user.username} has been timed out`,
  additonalValueField: TimeoutDurationField,
});

const KickDialog = withProps(ActionDialog)({
  label: 'Member to kick',
  header: (
    <>
      <Icon as={HiUserMinus} /> Kick
    </>
  ),
  confirmText: 'Kick',
  toastMessage: (user) => `${user.username} has been kicked.`,
});

const BanDialog = withProps(ActionDialog)({
  label: 'Member to permanently ban',
  header: (
    <>
      <Icon as={HiMegaphone} /> Ban
    </>
  ),
  confirmText: 'Ban',
  toastMessage: (user) => `${user.username} has been banned.`,
});

const PurgeDialog = withProps(ActionDialog)({
  label: "Who's our little troublemaker?",
  header: (
    <>
      <Icon as={HiMegaphone} /> Purge
    </>
  ),
  confirmText: 'Purge',
  hint: (
    <>
      <Text as="p">
        Purging a user bans them and completely erases all past their messages
        from the server.
      </Text>
      <Text as="p">
        This will take <strong>a very long time</strong> that grows with the
        total amount of messages in the server.
      </Text>
      <Text as="p">
        Please be patient and <strong>don't spam</strong> the action if you
        don't see any immediate results.
      </Text>
    </>
  ),
});

const ConfirmPurgeDialog: FC<{
  isOpen: boolean;
  member: DiscordGuildMember | undefined;
  onConfirm: (member: DiscordGuildMember) => Promise<void>;
  onClose: () => void;
}> = ({ onConfirm, member, onClose, isOpen }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const confirm = useCallback(() => {
    if (!member) return;
    onConfirm(member)
      .then(() => {
        toast({
          status: 'success',
          title: `${member.username} is now being purged.`,
        });
      })
      .then(() => onClose());
  }, [onConfirm, member, onClose, toast]);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogBody>
          <Text as="p">
            Are you really sure you want to purge&nbsp;
            <strong>{member?.displayName}</strong> (@{member?.username})?
          </Text>
          <Text as="p">It will be like they never even existed. 👀</Text>
        </AlertDialogBody>
        <AlertDialogFooter css={gapChildrenHorizontally()}>
          <Button
            ref={cancelRef}
            onClick={onClose}
            leftIcon={<Icon as={HiXMark} />}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button onClick={confirm} leftIcon={<Icon as={HiCheck} />}>
            Yes, purge them now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ActionDialogs: FC<{
  members: DiscordGuildMember[];
  shownDialog: 'timeout' | 'kick' | 'ban' | 'purge' | undefined;
  onClose: () => void;
}> = ({ shownDialog, onClose, members }) => {
  const [purgeMember, setPurgeMember] = useState<
    DiscordGuildMember | undefined
  >(undefined);
  const { timeout, kick, ban, purge } = useModerationActions();
  return (
    <>
      <TimeoutDialog
        isOpen={shownDialog === 'timeout'}
        onClose={onClose}
        members={members}
        onConfirm={({ userId }, additional) =>
          timeout({ userId, duration: additional })
        }
      />
      <KickDialog
        isOpen={shownDialog === 'kick'}
        onClose={onClose}
        members={members}
        onConfirm={({ userId }) => kick({ userId })}
      />
      <BanDialog
        isOpen={shownDialog === 'ban'}
        onClose={onClose}
        members={members}
        onConfirm={({ userId }) => ban({ userId })}
      />
      <PurgeDialog
        isOpen={shownDialog === 'purge' && !purgeMember}
        onClose={onClose}
        members={members}
        onConfirm={(member) => {
          setPurgeMember(member);
          return Promise.resolve();
        }}
      />
      <ConfirmPurgeDialog
        isOpen={shownDialog === 'purge' && !!purgeMember}
        onClose={() => {
          setPurgeMember(undefined);
          onClose();
        }}
        member={purgeMember}
        onConfirm={({ userId }) => purge({ userId })}
      />
    </>
  );
};
