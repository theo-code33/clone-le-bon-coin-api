const PhotoController = {
    create: async (req, res) => {
        const { files } = req;
        const { Location } = await AwsS3_service(files[0]);
        const photo = new Photo({
            url: Location
        })
        try {
            await photo.save();
            res.send(photo);
        } catch (error) {
            throw new Error(error);
        }
    }
}