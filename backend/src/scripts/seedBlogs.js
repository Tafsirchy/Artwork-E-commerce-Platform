const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const blogsData = [
  {
    title: "The Silent Evolution of Digital Minimalism",
    subtitle: "Exploring the intersection of code and canvas in the 21st century.",
    excerpt: "How the intersection of code and canvas is redefining the boundaries of contemporary art in the 21st century.",
    author: "Elena Vance",
    role: "Senior Curator",
    category: "Perspective",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1600",
    image2: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1600",
    publishedAt: new Date("2024-05-12"),
    content: [
      {
        type: "paragraph",
        text: "In the rapidly shifting landscape of contemporary art, a new movement has begun to emerge—one that doesn't just embrace technology, but breathes it. Digital minimalism is no longer just a design choice; it is a philosophy of reduction that seeks to find the soul within the machine."
      },
      {
        type: "quote",
        text: "Art is not what you see, but what you make others see through the absence of noise."
      },
      {
        type: "heading",
        text: "The Architecture of Silence"
      },
      {
        type: "paragraph",
        text: "When we strip away the superfluous, we are left with the essence. In our latest series, we've observed how artists are using negative space not as an empty void, but as a deliberate medium. This architectural approach to digital canvas allows for a deeper connection between the viewer and the intent of the creator."
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200",
        caption: "Geometric Harmony: A study in balance."
      },
      {
        type: "paragraph",
        text: "As we look toward the future, the boundaries between the physical and the virtual continue to blur. BRISTIII remains at the forefront of this evolution, curating fragments of visions that challenge our perception of what 'original' means in an age of infinite reproduction."
      }
    ]
  },
  {
    title: "Curation in the Age of Algorithms",
    subtitle: "Navigating the digital ocean of endless creativity.",
    excerpt: "Exploring the delicate balance between human intuition and machine precision in gallery management.",
    author: "Marcus Thorne",
    role: "Gallery Director",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600",
    publishedAt: new Date("2024-04-28"),
    content: [
      {
        type: "paragraph",
        text: "We live in an age where algorithms dictate taste. But can a machine truly understand the emotional resonance of a brushstroke?"
      },
      {
        type: "heading",
        text: "The Human Element"
      },
      {
        type: "paragraph",
        text: "True curation requires empathy, history, and a touch of the irrational. That is what we protect at BRISTIII."
      }
    ]
  },
  {
    title: "Echoes of the Renaissance: Modern Shards",
    subtitle: "A deep dive into our latest series 'The Living Canvas'.",
    excerpt: "A deep dive into our latest series 'The Living Canvas' and its connection to classical form.",
    author: "Julian Artwell",
    role: "Resident Artist",
    category: "Exhibition",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1600",
    publishedAt: new Date("2024-04-15"),
    content: [
      {
        type: "paragraph",
        text: "Classical techniques are not dead; they are being fractured and reassembled in digital forms. Our 'Living Canvas' exhibition demonstrates exactly this."
      }
    ]
  },
  {
    title: "The Collector's Soul: A Journey into Acquisition",
    subtitle: "What drives the desire to own a piece of infinity?",
    excerpt: "Understanding the emotional resonance that drives the modern art collector in a digital landscape.",
    author: "Sophia Chen",
    role: "Acquisitions Expert",
    category: "Collection",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600",
    publishedAt: new Date("2024-03-22"),
    content: [
      {
        type: "paragraph",
        text: "To collect art is to collect pieces of one's own identity."
      }
    ]
  }
];

const seedBlogs = async () => {
  try {
    // Determine MONGO_URI
    const uri = process.env.MONGO_URI || "mongodb+srv://tafsirchy2:Yq9Xv3jOigk3pE7q@cluster0.thctv2s.mongodb.net/bristiii?retryWrites=true&w=majority&appName=Cluster0";
    
    await mongoose.connect(uri);
    console.log("MongoDB Connected for Seeding Blogs...");

    await Blog.deleteMany();
    console.log("Existing Blogs cleared.");

    await Blog.insertMany(blogsData);
    console.log("New Blogs Seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();
