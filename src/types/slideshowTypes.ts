import { z } from 'zod';
import { VIDEO_FPS } from './constants';

export const SlideshowProps = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  song: z.string().url("Song must be a valid URL or resolvable path"), // Or z.string() if it's a local path processed by staticFile
});

export const defaultSlideshowProps: z.infer<typeof SlideshowProps> = {
  title: 'Image Slideshow',
  images: ['https://sdmntpreastus.oaiusercontent.com/files/00000000-0ed4-61f9-85d3-abf049863301/raw?se=2025-05-22T03%3A32%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=f4bed305-50f0-5b38-b423-f70a2730b700&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A20%3A54Z&ske=2025-05-22T20%3A20%3A54Z&sks=b&skv=2024-08-04&sig=rIoRy2de2cciuoo6yEqHduGGuYEUlrObwHzGalS9q5M%3D', 'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-e7f8-61f7-b837-3d8daf448aaf/raw?se=2025-05-22T03%3A32%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=93138e7b-ae45-5cff-8d10-f79992d40139&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A20%3A31Z&ske=2025-05-22T20%3A20%3A31Z&sks=b&skv=2024-08-04&sig=LnSYE1Eb5PP5uMI282kPQZ5haMiDyJkRB6YXkrXN8Yc%3D', 'https://sdmntprwestus.oaiusercontent.com/files/00000000-2cbc-6230-8247-65ffecc3a890/raw?se=2025-05-22T03%3A33%3A17Z&sp=r&sv=2024-08-04&sr=b&scid=1f7545dc-887b-5d10-bdee-691d1ea270a2&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A20%3A45Z&ske=2025-05-22T20%3A20%3A45Z&sks=b&skv=2024-08-04&sig=rQNCARiGc3TJz1abSvxcaVVh%2Bujr89dbU0spkhIy4SY%3D', 'https://sdmntpreastus2.oaiusercontent.com/files/00000000-44c4-51f6-88b9-895900da671c/raw?se=2025-05-22T03%3A33%3A24Z&sp=r&sv=2024-08-04&sr=b&scid=f98a9a31-e526-54e0-8e8d-d1fb157e4741&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A19%3A13Z&ske=2025-05-22T20%3A19%3A13Z&sks=b&skv=2024-08-04&sig=BCREwAQYVoc1vxW6EyNYAFVv27k8q2zCXfDTR2/6yJI%3D', 'https://sdmntpreastus2.oaiusercontent.com/files/00000000-a224-51f6-bc83-c19b0fade2cd/raw?se=2025-05-22T03%3A33%3A32Z&sp=r&sv=2024-08-04&sr=b&scid=4e12c661-3118-5dff-a08f-f87c46a66b1c&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A19%3A52Z&ske=2025-05-22T20%3A19%3A52Z&sks=b&skv=2024-08-04&sig=kNwPrKXjjyrXrqnn5dV3wlCFk02b9/QdTU3%2BXZ3aMTA%3D'],
  song: 'https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3',
};

export const SLIDESHOW_DURATION_IN_FRAMES = 20 * VIDEO_FPS;