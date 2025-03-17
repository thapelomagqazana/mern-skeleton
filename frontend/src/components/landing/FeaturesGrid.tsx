import FeatureCard from './FeatureCard';
import { FaServer, FaReact, FaLock } from 'react-icons/fa';

export default function FeaturesGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What’s Inside</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="FastAPI Backend"
            description="Robust REST API with JWT Auth and MongoDB or PostgreSQL."
            icon={<FaServer />}
          />
          <FeatureCard
            title="React Frontend"
            description="Modern UI with Vite, TypeScript, and Tailwind."
            icon={<FaReact />}
          />
          <FeatureCard
            title="Secure Authentication"
            description="JWT-based auth for secure access."
            icon={<FaLock />}
          />
        </div>
      </div>
    </section>
  );
}
