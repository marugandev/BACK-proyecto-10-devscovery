const events = [
  {
    title: "Tech Innovation Summit 2024",
    description:
      "Una conferencia para discutir las últimas tendencias en inteligencia artificial y tecnología.",
    date: new Date("2024-11-15T09:00:00"), // Fecha en formato ISO
    duration: 480, // Duración en minutos (8 horas)
    img: "",

    location: "Centro de Convenciones, Ciudad de México",
    isVirtual: false,
    virtualLink: "", // No es necesario ya que es un evento físico

    organizer: "Tech Conferences Ltd.",
    maxAttendees: 500,
    attendees: [
      /*   ObjectId(), // Referencia a un usuario (ID de ejemplo)
      ObjectId() // Otro usuario */
    ]
  },
  {
    title: "Web Development Trends 2024",
    description:
      "Un webinar enfocado en las nuevas tecnologías web como frameworks de JavaScript y web 3.0.",
    date: new Date("2024-12-01T18:00:00"),
    duration: 120,
    img: "", // Duración en minutos (2 horas)

    location: "", // Vacío porque es un evento virtual
    isVirtual: true,
    virtualLink: "https://webinar-platform.com/webdev-trends-2024",

    organizer: "Online Webinars Inc.",
    maxAttendees: 1000,
    attendees: [
      /*  ObjectId(), // Referencia a un usuario (ID de ejemplo)
      ObjectId() // Otro usuario */
    ]
  }
];

module.exports = events;
