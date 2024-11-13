import { AttachmentType } from '@prisma/client';

/**
 * Utility function to check which type the contentType is,
 * used to check the type of a attachment of a message.
 * @param contentType string that contains the content type e.g vide/mp4
 * @returns AttachmentType enum value for the given type
 */
function getAttachmentType(contentType: string): AttachmentType {
  if (contentType.startsWith('image/')) {
    return AttachmentType.IMAGE;
  } else if (contentType.startsWith('video/')) {
    return AttachmentType.VIDEO;
  } else if (contentType.startsWith('audio/')) {
    return AttachmentType.AUDIO;
  } else {
    return AttachmentType.OTHER;
  }
}

export default getAttachmentType;
