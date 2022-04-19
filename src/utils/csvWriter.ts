import { createObjectCsvWriter } from "csv-writer";

const csvWriterObject = (module: String, fileName: string) => {
    const csvWriter = createObjectCsvWriter({
        path: `data/${module}/${fileName}`,
        header: [
            { id: "email", title: "EMAIL" },
            { id: "password", title: "PASSWORD" },
        ],
    });

    return csvWriter;
};

export default csvWriterObject;
