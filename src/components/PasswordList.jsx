import React from 'react';

function PasswordList({ passArray, handleCopytext, handleEdit, deletePassword }) {
  return (
    <div className="passwords">
      {passArray.length === 0 && <div>No Passwords to show</div>}
      {passArray.length !== 0 && (
        <table className="table-auto w-full rounded-md overflow-hidden mb-7">
          <thead className="text-white bg-green-800">
            <tr>
              <th className="py-1">website URL</th>
              <th className="py-1">Username</th>
              <th className="py-1">Password</th>
              <th className="py-1">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-green-100">
            {passArray.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="border border-white text-center py-2 w-auto">
                    <div className="flex items-center justify-center">
                      <a href={item.site} target="_blank">
                        {item.site}
                      </a>
                      <div
                        className="lordiconCopy cursor-pointer mx-1 size-7"
                        onClick={() => handleCopytext(item.site)}
                      >
                        <img
                          className=""
                          style={{
                            height: "22px",
                            width: "25px",
                            paddingTop: "1px",
                          }}
                          src="/copy.png"
                          alt="site"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="border border-white text-center py-2 ">
                    <div className="flex items-center justify-center">
                      <span> {item.username}</span>
                      <div
                        className="lordiconCopy size-7 cursor-pointer"
                        onClick={() => handleCopytext(item.username)}
                      >
                        <img
                          className="inline items-center"
                          style={{
                            height: "20px",
                            width: "25px",
                            paddingTop: "1px",
                          }}
                          src="/copy.png"
                          alt="username"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="border border-white text-center py-2 ">
                    <div className="flex items-center justify-center">
                      <span>{"*".repeat((item.password).length)}</span>
                      <div
                        className="lordiconCopy cursor-pointer mx-1 size-7"
                        onClick={() => handleCopytext(item.password)}
                      >
                        <img
                          className="cursor-pointer inline items-center mx-1"
                          style={{
                            height: "20px",
                            width: "25px",
                            paddingTop: "1px",
                          }}
                          src="/copy.png"
                          alt="password"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="border border-white text-center py-2">
                    <div className="flex justify-center items-center">
                      <span onClick={() => handleEdit(item.id)}>
                        <img
                          src="/edit.png"
                          alt="edit"
                          style={{
                            height: "25px",
                            width: "25px",
                            paddingTop: "1px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                        />
                      </span>
                      <span onClick={() => deletePassword(item.id)}>
                        <img
                          src="/delete.png"
                          alt="delete"
                          style={{
                            height: "25px",
                            width: "25px",
                            paddingTop: "1px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PasswordList; 