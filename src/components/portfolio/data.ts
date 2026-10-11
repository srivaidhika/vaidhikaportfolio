export const LINKS = {
  linkedin: "https://www.linkedin.com/in/sri-vaidhika-kotha/",
  github: "https://github.com/srivaidhika",
  email: "srivaidhikakotha@gmail.com",
  resume: "/Sri-Vaidhika-Kotha-Resume.pdf",
};

export type SkillGroup = { id: string; title: string; x: number; y: number; items: { name: string; note: string }[] };

export const SKILLS: SkillGroup[] = [
  {
    id: "be", title: "Backend Engineering", x: 22, y: 30,
    items: [
      { name: "Java", note: "Primary language for the Movie Booking System backend." },
      { name: "Spring Boot", note: "Framework behind the movie booking APIs and the Super App backend." },
      { name: "Hibernate", note: "ORM used for persisting movies and bookings." },
      { name: "JPA", note: "Entity mapping and repositories for data persistence." },
      { name: "REST APIs", note: "Full CRUD endpoints, tested and validated with Postman." },
    ],
  },
  {
    id: "pg", title: "Programming", x: 70, y: 18,
    items: [
      { name: "Python", note: "Fake-news classifier (Naive Bayes, Flask) and the smart-helmet ML model." },
      { name: "C", note: "Programming fundamentals from coursework." },
      { name: "JavaScript", note: "Used across web interfaces." },
      { name: "Dart", note: "Language of the Flutter Super App frontend." },
    ],
  },
  {
    id: "fe", title: "Frontend Development", x: 80, y: 62,
    items: [
      { name: "Flutter", note: "Building the Customer Super App interface end to end." },
      { name: "React.js", note: "Front-end development, including web interfaces." },
      { name: "HTML / CSS", note: "Responsive layouts — e.g. the Traditional Culture of India app." },
      { name: "Angular", note: "Working knowledge, currently building it up." },
    ],
  },
  {
    id: "ai", title: "Artificial Intelligence", x: 46, y: 82,
    items: [
      { name: "AI/ML fundamentals", note: "Core specialization of my B.Tech in CSE (AI & ML)." },
      { name: "NLP classification", note: "Multinomial Naive Bayes for real/fake news detection." },
      { name: "Agentic AI basics", note: "Fundamentals of Agentic AI — Hugging Face course." },
    ],
  },
  {
    id: "dp", title: "Development Practices", x: 14, y: 72,
    items: [
      { name: "API integration", note: "Connecting the Flutter frontend to Spring Boot REST APIs." },
      { name: "PostgreSQL / MySQL", note: "Database modelling and persistence; pgAdmin for management." },
      { name: "Git & GitHub", note: "Team collaboration within SDLC workflows at my internship." },
      { name: "Postman", note: "API testing and debugging." },
    ],
  },
];
