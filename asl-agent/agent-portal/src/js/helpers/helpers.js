import moment from 'moment'
import {
    nanoid
} from 'nanoid'

/**
 * description: this function is used to format the date
 * @param {String} date 
 * @returns {String}
 */
export const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY');
}

/**
 * description: this function is used to generate a unique id for sections.
 * @returns {String}
 */
export const generateId = () => {
    return nanoid(10);
}
/**
 * description: this method is used to find the parent and child index of a report section. It returns an object containing parent and child indexes. It uses the id of the section to find the report section, it takes three parameters first one is stack from where we have to find the indexes and second one is the nodeId of the section and third one is the substack key which is actually the key of the array holding the children.
 * @param {Array} stack 
 * @param {String} nodeId 
 * @param {String} subStackKey 
 * @returns {Object}
 */
export const findNodeById = (stack, nodeId, subStackKey) => {
    let parent = -1,
        child = -1;
    stack.every((section, stackIndex) => {
        if (section['id'] === nodeId) {
            parent = stackIndex;
            child = -1
            return false;
        } else if (section[subStackKey] && section[subStackKey].length) {
            let childIndex = section[subStackKey].findIndex(node => node.id === nodeId);
            if (childIndex !== -1) {
                parent = stackIndex;
                child = childIndex;
                return false;
            }

        }
        return true;
    })
    return {
        child: child,
        parent: parent
    }

}

export const createReportObject = () => {
   return {
        report_name: "",
        report_thumbnail: "",
        countries: [],
        categories: [],
        birth_incorporation_date: "",
        entity_type: "person",
        report_sections: [
          {
            id: "bb5dc8842c",
            label: "Report Details",
            children: [],
          },
          {
            id: "bb5dc8843c",
            label: "Document Details",
            children: [],
          },
          {
            id: "bb5dc8844c",
            label: "Search Information",
            children: [],
          },
          {
            id: "bb5dc8845c",
            label: "Introduction",
            children: [],
          },
          {
            id: "bb5dc8846c",
            label: "Summary Report",
            children: [],
          },
          {
            id: "bb5dc8847c",
            label: "Detailed Report Sanctions",
            children: [],
          },
          {
            id: "bb5dc8848c",
            label: "Linked Individuals",
            children: [],
          },
          {
            id: "bb5dc8849c",
            label: "Linked Companies",
            children: [],
          },
          {
            id: "bb5dc8850c",
            label: "Roles",
            children: [],
          },
          {
            id: "bb5dc8851c",
            label: "Source Adverse Media",
            children: [],
          },
          {
            id: "bb5dc8852c",
            label: "Important Events",
            children: [],
          },
          {
            id: "bb5dc8853c",
            label: "Biography",
            children: [],
          },
          {
            id: "bb5dc8854c",
            label: "PEP Listings",
            children: [],
          },
          {
            id: "bb5dc8855c",
            label: "Adverse Media Listings",
            children: [],
          },
          {
            id: "bb5dc8856c",
            label: "AML/FATF Profile (edited)",
            children: [],
          },
        ],
        report_data: [
          {
            id: "bb5dc8842c",
            name: "Report Details",
            fields: [
              {
                label: "Entity/Bussiness Name",
                name: "report_name",
                type: "text",
                placeholder: "Enter Entity/Bussiness Name",
                value: "",
                field_type: "basic",
              },
              {
                label: "Birth/Incorporation Date",
                name: "birth_incorporation_date",
                type: "date",
                placeholder: "Enter Birth/Incorporation Date",
                value: "",
                field_type: "basic",
              },
              {
                label: "Category",
                name: "categories",
                type: "select",
                placeholder: "Select",
                value: [],
                options: [],
                field_type: "basic",
              },
              {
                label: "Country",
                name: "countries",
                type: "select",
                placeholder: "Select",
                value: [],
                options: [],
                field_type: "basic",
              },
              {
                label: "Is Company ?",
                name: "entity_type",
                type: "checkbox",
                placeholder: "",
                value: "person",
                field_type: "basic",
              },
            ],
          },
          {
            id: "bb5dc8843c",
            name: "Document Details",
            fields: []
          },
          {
            id: "bb5dc8844c",
            name: "Search Information",
            fields: []
          },
          {
            id: "bb5dc8845c",
            name: "Introduction",
            fields: []
          },
          {
            id: "bb5dc8846c",
            name: "Summary Report",
            fields: []
          },
          {
            id: "bb5dc8847c",
            name: "Detailed Report Sanctions",
            fields: []
          },
          {
            id: "bb5dc8848c",
            name: "Linked Individuals",
            fields: []
          },
          {
            id: "bb5dc8849c",
            name: "Linked Companies",
            fields: []
          },
          {
            id: "bb5dc8850c",
            name: "Roles",
            fields: []
          },
          {
            id: "bb5dc8851c",
            name: "Source Adverse Media",
            fields: []
          },
          {
            id: "bb5dc8852c",
            name: "Important Events",
            fields: []
          },
          {
            id: "bb5dc8853c",
            name: "Biography",
            fields: []
          },
          {
            id: "bb5dc8854c",
            name: "PEP Listings",
            fields: []
          },
          {
            id: "bb5dc8855c",
            name: "Adverse Media Listings",
            fields: []
          },
          {
            id: "bb5dc8856c",
            name: "AML/FATF Profile (edited)",
            fields: []
          },
        ],
      }

}