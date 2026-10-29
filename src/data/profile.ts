/**
 * PROFILE DATA — edit this file to change the text on your portfolio.
 * (Once the admin dashboard + database are set up, values saved in /admin
 * override these defaults.)
 */

export type SocialLinks = {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
};

export const profile = {
  name: "KARUPPASAMY C",
  firstName: "Karuppasamy",
  title: "Full Stack Developer | Creative Video Editor | AI Enthusiast | Digital Creator",
  roles: ["Developer", "Creator", "Marketer", "Innovator"],
  heroHeadline: ["Building Digital Experiences.", "Creating Beyond Imagination."],
  heroDescription:
    "I'm Karuppasamy, a developer and digital creator combining modern web technologies, creative storytelling, digital marketing, and artificial intelligence to build impactful digital experiences.",
  about:
    "I'm a Computer Science Engineering graduate passionate about modern web development, creative video editing, AI technologies, and digital marketing. With hands-on experience managing e-commerce websites and social media, I bring together technical problem-solving and creative thinking to deliver engaging digital experiences.",
  languages: ["Tamil", "English"],
  // Put a photo in /public (e.g. /public/profile.jpg) and set "/profile.jpg". Leave "" to hide.
  profileImage: "",
  // Leave a link as "" until you have the real URL — empty links are hidden, never faked.
  links: {
    email: "karuppu786891@gmail.com",
    github: "",
    linkedin: "",
    instagram: "",
  } as SocialLinks,
};

export type Profile = typeof profile;
