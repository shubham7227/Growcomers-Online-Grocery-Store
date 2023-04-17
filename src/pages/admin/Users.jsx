import React from "react";
import AdminLayout from "../../components/common/AdminLayout";
import AdminPageHeader from "../../components/admin/commons/AdminPageHeader";
import UsersList from "../../components/admin/users/UsersList";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="adminContainer">
        <AdminPageHeader title="Users" />

        <section className="adminMainContainer">
          <div className="flex flex-row w-full justify-between items-center">
            <h4 className="heading4">User List</h4>
          </div>
          <UsersList />
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
