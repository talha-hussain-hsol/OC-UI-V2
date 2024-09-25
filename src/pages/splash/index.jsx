import React from "react";
import useSpashHook from "../../hooks/useSplashHook";
import { TbLogout } from "react-icons/tb";
import Loader from "../../components/ui/loader";

const SplashScreen = () => {
  const {
    entites,
    activePortal,
    portals,
    handleActivePortal,
    handlePermission,
    isLoader,
  } = useSpashHook();

  const filteredEntities = entites?.filter((row) => row?.type === activePortal);
  const dummyImage =
    "https://storage.googleapis.com/ascentfs-media-public/public-data/application/logo.compliance.entity.png";

  if (isLoader) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left side  */}
      <div className="w-full lg:w-[40%] bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90% p-8 text-white">
        <div className="mt-4 ml-6">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <h1 className="text-3xl font-bold mb-2">Admin Compliance</h1>
          <p className="text-sm font-light mb-6 text-slate-500">
            What do we want to do today?
          </p>

          <div className="flex justify-end">
            <button className="w-[20%] flex text-xs mb-3 px-3 mr-5 py-1 bg-[#2c7be5] hover:bg-[#4472c8] rounded text-white">
              <TbLogout className="text-lg mr-1" /> LOGOUT
            </button>
          </div>

          {/* Display Fixed Tabs */}
          <div className="flex">
            {portals.map((portal, index) => (
              <button
                key={index}
                onClick={() => handleActivePortal(portal.type)} 
                className={`px-2 py-2 rounded-full font-light text-xs ${
                  activePortal === portal.type ? "text-white" : "text-slate-500"
                } hover:text-white`}
              >
                {portal.label} {/* Display the portal label */}
              </button>
            ))}
          </div>
          <hr className="w-full border-t border-t-[#6e84a3] opacity-30 my-3 " />

          {/* List of Entities Based on Active Portal */}

          <div className="overflow-y-auto max-h-96">
            {filteredEntities?.map((row, index) => {
              const specificEntityData = row.entity || row;
              const meta =
                specificEntityData?.meta || specificEntityData?.entityMeta;
              const entityTitle =
                specificEntityData?.title ||
                specificEntityData?.entityTitle ||
                "";
              const entityType = specificEntityData?.type;
              const logo =
                typeof meta === "string"
                  ? JSON.stringify(meta)?.entity_logo
                  : meta?.entity_logo;
              return (
                <div key={index} className="mb-3">
                  <div className="flex items-center">
                    <div className="w-15 h-10 mb-2 bg-white mr-4 flex-shrink-0">
                      <img
                        src={logo || dummyImage}
                        alt="Logo"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-full">
                      <div
                        onClick={() => handlePermission(specificEntityData)}
                        className="font-light text-white hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {entityTitle} {/* Display the entity title */}
                      </div>
                      <p className="text-sm text-gray-400 font-light">
                        {entityType}
                      </p>
                    </div>
                  </div>
                  <hr className="w-full border-t border-t-[#6e84a3] opacity-30 mt-2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="relative w-full lg:w-[65%] lg:bg-cover lg:bg-center bg-gradient-to-r from-[#0f3057] to-[#13203f]"
        style={{
          backgroundImage: `url('https://dev-portal.one-constellation.com/img/splash.jpg')`,
        }}
      >
        <div className="absolute top-0 left-0 w-full lg:static flex justify-end lg:items-start p-4 lg:bg-transparent bg-[#13203f]">
          <button className="bg-blue-500 text-white font-light text-xs px-2 py-2 border border-black rounded-[15px]">
            Last Synced at: 3:58:43 PM <br />
            Synced
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
