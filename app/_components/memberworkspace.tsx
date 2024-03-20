import React, { useEffect } from "react";

interface WorkspaceMember {
  user_name: string;
  member_role: string;
  member_joined_date: Date;
}

function memberworkspace({ member }: { member: WorkspaceMember }) {
  useEffect(() => {
    console.log(member);
  });
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap sm:px-3">
          {member.user_name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap sm:px-3">
          {member.member_joined_date.toString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap sm:px-3">
          {member.member_role}
        </td>
      </tr>
    </tbody>
  );
}

export default memberworkspace;
