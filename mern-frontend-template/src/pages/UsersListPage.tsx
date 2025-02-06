/**
 * @file UsersListPage.tsx
 * @description Displays a list of registered users.
 * - Fetches users from `/api/users`
 * - Displays users in a Material-UI table
 * - Handles loading and error states
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  Container,
} from "@mui/material";

/**
 * Fetch users and display them in a table
 */
const UsersListPage: React.FC = () => {
  const { data: usersObj, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Ensure usersObj exists before accessing .users
  const usersList = usersObj?.users || [];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        Users List
      </Typography>

      {/* Show loading spinner while fetching data */}
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <CircularProgress />
        </div>
      )}

      {/* Show error message if API request fails */}
      {isError && <Alert severity="error">Failed to load users. Please try again.</Alert>}

      {/* Render users table if data is available */}
      {usersList.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !isLoading && <Alert severity="info">No users found.</Alert>
      )}
    </Container>
  );
};

export default UsersListPage;
