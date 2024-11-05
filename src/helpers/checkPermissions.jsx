
// import { useSelector } from 'react-redux'
// export default function checkPermissions(permissionName) {
//     const permissions = useSelector((state) => state);
//     var hasPermission = false;
//     var allPermissions = permissions?.permissions
//     if (allPermissions?.length > 0) {
//         hasPermission = allPermissions.includes(permissionName);
//     }
//     console.log("hasPermission",hasPermission)
//     console.log("hasPermission permissions",permissions)
//     return hasPermission;
//     // return true;
// }

import { useSelector } from 'react-redux';

export default function checkPermissions(permissionName) {
    const allPermissions = useSelector((state) => state.permissions);
    let hasPermission = false;

    if (allPermissions?.length > 0) {
        hasPermission = allPermissions.includes(permissionName);
    }

    console.log("hasPermission", hasPermission);
    console.log("hasPermission permissions", allPermissions);
    return hasPermission;
}
