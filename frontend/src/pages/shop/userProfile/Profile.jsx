import React from "react";
import AccountDetails from "../../../components/shop/profile/personalInfo/AccountDetails";
import EmailDetails from "../../../components/shop/profile/personalInfo/EmailDetails";
import ProfileLayout from "../../../components/shop/profile/ProfileLayout";
import DeleteAccount from "../../../components/shop/profile/personalInfo/DeleteAccount";
import PasswordDetails from "../../../components/shop/profile/personalInfo/PasswordDetails";

const Profile = () => {
  return (
    <ProfileLayout>
      <section className="p-4 flex-1 flex flex-col gap-4">
        <div className="pb-4">
          <h2 className="heading2">My Details</h2>
        </div>
        <AccountDetails />
        <EmailDetails />
        <PasswordDetails />
        <DeleteAccount />
      </section>
    </ProfileLayout>
  );
};

export default Profile;
