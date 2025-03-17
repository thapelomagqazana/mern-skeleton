export default function APIList() {
    const apiRoutes = [
      { method: 'POST', route: '/auth/signup', description: 'Create new user account' },
      { method: 'POST', route: '/auth/signin', description: 'Authenticate user and get JWT token' },
      { method: 'POST', route: '/auth/signout', description: 'Invalidate current JWT token' },
      { method: 'GET', route: '/api/users', description: 'List all users (paginated)' },
      { method: 'GET', route: '/api/users/{id}', description: 'Get a user by ID' },
      { method: 'PUT', route: '/api/users/{id}', description: 'Update a user by ID' },
      { method: 'DELETE', route: '/api/users/{id}', description: 'Delete a user by ID' },
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">🔌 API Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Method</th>
                  <th className="px-4 py-2 border">Route</th>
                  <th className="px-4 py-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {apiRoutes.map((api, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-4 py-2 border font-bold">
                      <span
                        className={`${
                          api.method === 'GET'
                            ? 'text-green-600'
                            : api.method === 'POST'
                            ? 'text-blue-600'
                            : api.method === 'PUT'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {api.method}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">{api.route}</td>
                    <td className="px-4 py-2 border">{api.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
}
  