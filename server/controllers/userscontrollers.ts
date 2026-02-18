const userController = {
    getAllUsers: (req: any, res: any) => {
        res.send("Get all users");
    },
    getUserById: (req: any, res: any) => {
        res.send("Get user by id");
    },
    createUser: (req: any, res: any) => {
        res.send("Create user");
    },
    updateUser: (req: any, res: any) => {
        res.send("Update user");
    },
    deleteUser: (req: any, res: any) => {
        res.send("Delete user");
    }
}

export default userController;

