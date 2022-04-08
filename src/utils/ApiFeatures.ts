/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Query } from "mongoose";
import { DEFAULT_PAGE_NUMBER, DEFAULT_LIMIT } from "../constants/ApiFeatures.constants";

class apiFeatures {
    query: Query<any[] | any, any, {}, any>;
    queryString: { page?: string; limit?: string; sort?: string; search?: string };

    constructor(query: Query<any, any, {}, any>, queryString: { page?: string; limit?: string }) {
        this.query = query;
        this.queryString = queryString;
    }

    paginate() {
        let pageNumber: number = DEFAULT_PAGE_NUMBER;
        if (Number(this.queryString.page) && Number(this.queryString.page) > 0) {
            pageNumber = Number(this.queryString.page);
        }

        // if limit = 0 it will returns all the records.
        let hitsLimit = DEFAULT_LIMIT;
        if (Number(this.queryString.limit) && Number(this.queryString.limit) > 0) {
            hitsLimit = Number(this.queryString.limit);
            const skip = (pageNumber - 1) * hitsLimit;
            this.query = this.query.skip(skip).limit(hitsLimit);
        }

        return { query: this, pageNumber, hitsLimit };
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields(master: string = "") {
        switch (master) {
            case "role":
                this.query.select("name updatedBy updatedAt");
                break;

            case "class":
                this.query.select("name students teacher updatedAt updatedBy");
                break;
        }
        return this;
    }

    populateUpdatedBy() {
        this.query = this.query.populate("updatedBy", "name");
        return this;
    }

    populate(populateField: string, fields: string) {
        this.query = this.query.populate(populateField, fields);
        return this;
    }

    search(searchFor: string[]) {
        if (this.queryString.search) {
            const regex = new RegExp(this.queryString.search);
            const $or = searchFor.map((element) => {
                return { [element]: { $regex: regex, $options: "i" } };
            });
            this.query = this.query.find({ $or });
        }
        return this;
    }
}

export const getCount = async (model: Model<any, {}, {}, {}>) => {
    return await model.countDocuments({ isActive: true });
};

export default apiFeatures;
