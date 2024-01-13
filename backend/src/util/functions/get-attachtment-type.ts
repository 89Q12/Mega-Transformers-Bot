import { AttachmentType } from '@prisma/client';

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
