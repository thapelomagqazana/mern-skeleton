interface ProfileInfoProps {
    email: string;
  }
  
  const ProfileInfo = ({ email }: ProfileInfoProps) => {
    return (
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p className="text-gray-700">
          <strong>Email:</strong> {email}
        </p>
      </div>
    );
  };
  
  export default ProfileInfo;
  