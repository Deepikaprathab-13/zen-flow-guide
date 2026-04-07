import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Leaf, Wind, Activity, Sun } from "lucide-react";
import { getCategoryDescription } from "@/data/poses";
import { Category } from "@/data/types";

const categoryMeta: Record<Category, { icon: React.ElementType; gradient: string }> = {
  "Beginner": { icon: Leaf, gradient: "from-primary to-primary/70" },
  "Weight Loss": { icon: Flame, gradient: "from-secondary to-secondary/70" },
  "Stress Relief": { icon: Wind, gradient: "from-primary/80 to-primary/50" },
  "Flexibility": { icon: Activity, gradient: "from-secondary/80 to-secondary/50" },
  "Meditation": { icon: Sun, gradient: "from-primary/90 to-primary/60" },
};

const categories: Category[] = ["Beginner", "Weight Loss", "Stress Relief", "Flexibility", "Meditation"];

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24 md:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 md:pt-16">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Your Daily Practice
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Find Your Inner
              <span className="block text-primary"> Balance</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Discover yoga poses, build routines, and track your journey to a healthier, more mindful you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/poses"
                className="gradient-hero inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105"
              >
                Explore Poses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/routine"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 font-medium text-foreground transition-colors hover:bg-accent"
              >
                Generate Routine
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      </section>

      {/* Categories */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-semibold text-foreground md:text-3xl"
          >
            Choose Your Path
          </motion.h2>
          <p className="mt-2 text-muted-foreground">Select a category that matches your goal</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const { icon: Icon, gradient } = categoryMeta[cat];
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/poses?category=${encodeURIComponent(cat)}`}
                    className="group flex items-start gap-4 rounded-xl bg-card p-5 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
                  >
                    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {cat}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getCategoryDescription(cat)}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats / CTA */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl gradient-hero p-8 text-center text-primary-foreground md:p-12">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Start Your Journey Today
            </h2>
            <p className="mx-auto mt-3 max-w-md opacity-90">
              12 poses across 5 categories. Build routines, track progress, and transform your practice.
            </p>
            <Link
              to="/routine"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-8 py-3 font-medium text-foreground transition-transform hover:scale-105"
            >
              Get Your Routine <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
