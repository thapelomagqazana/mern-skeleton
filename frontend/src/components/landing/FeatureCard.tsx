type FeatureProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  
  export default function FeatureCard({ title, description, icon }: FeatureProps) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }
  