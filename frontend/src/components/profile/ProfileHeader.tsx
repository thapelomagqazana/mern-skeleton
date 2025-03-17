interface ProfileHeaderProps {
    name: string;
    role: string;
  }
  
  const ProfileHeader = ({ name, role }: ProfileHeaderProps) => {
    return (
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-gray-600">{role}</p>
      </div>
    );
  };
  
  export default ProfileHeader;
  