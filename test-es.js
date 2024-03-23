const unirest = require("unirest");

// insert all test
async function insertAll(testArray) {
  // must modify the _id to mongo_id else elasticsearch will throw an error
  return new Promise((resolve, reject) => {
    const bulkData = testArray.flatMap((doc) => [
      { index: { _index: "test", _id: doc.mongo_id } },
      doc,
    ]);
    unirest
      .post("https://localhost:9200/test/_bulk")
      .auth(process.env.ES_USERNAME, process.env.ES_PASSWORD)

      .headers({
        "Content-Type": "application/json",
      })
      .strictSSL(false)
      .send(bulkData.map(JSON.stringify).join("\n") + "\n")
      .end(function (response) {
        if (response.error) {
          console.error("Error:", response.error);
          reject(response.error);
        } else {
          console.log("Bulk Upload Response:", response.raw_body);
          resolve(JSON.parse(response.raw_body));
        }
      });
  });
}

// insert one solution
async function insertOne(mongoId, data) {
  return new Promise((resolve, reject) => {
    unirest
      .post("https://localhost:9200/test/_doc/" + mongoId)
      .auth(process.env.ES_USERNAME, process.env.ES_PASSWORD)

      .headers({
        "Content-Type": "application/json",
      })
      .strictSSL(false)
      .send(JSON.stringify(data))
      .end(function (response) {
        if (response.error) {
          console.error("Error: ", response.error);
          reject(response.error);
        } else {
          console.log("Insert One Solution Response:", response.raw_body);
          resolve(JSON.parse(response.raw_body));
        }
      });
  });
}

// Search solution
async function search(businessId, cardtype, query) {
  return new Promise((resolve, reject) => {
    unirest
      .get("https://localhost:9200/test/_search")
      .auth(process.env.ES_USERNAME, process.env.ES_PASSWORD)

      .headers({
        "Content-Type": "application/json",
      })
      .strictSSL(false)
      .send
      // JSON.stringify({
      //   size: 10,
      //   sort: [
      //     {
      //       _score: "desc",
      //     },
      //   ],
      //   query: {
      //     bool: {
      //       must: [
      //         {
      //           match: {
      //             cardtype: cardtype,
      //           },
      //         },
      //         {
      //           match: {
      //             business: businessId,
      //           },
      //         },
      //         {
      //           wildcard: {
      //             solutionname: {
      //               value: `*${query.toLowerCase()}*`,
      //             },
      //           },
      //         },
      //       ],
      //       should: [
      //         {
      //           wildcard: {
      //             solutionname: {
      //               value: `*${query.toLowerCase()}*`,
      //             },
      //           },
      //         },
      //         {
      //           wildcard: {
      //             solutionname: {
      //               value: `${query}*`,
      //               boost: 10,
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   },
      // })
      ()
      .end(function (response) {
        if (response.error) {
          console.error("Error: ", response.error);
          reject(response.error);
        } else {
          console.log("Search Medicine Response:", response.raw_body);
          resolve(JSON.parse(response.raw_body));
        }
      });
  });
}

// Update one solution
async function updateOne(mongoId, newData) {
  return new Promise((resolve, reject) => {
    unirest
      .post("https://localhost:9200/test/_update/" + mongoId)
      .auth(process.env.ES_USERNAME, process.env.ES_PASSWORD)
      .headers({
        "Content-Type": "application/json",
      })
      .strictSSL(false)
      .send(JSON.stringify({ doc: newData }))
      .end(function (response) {
        if (response.error) {
          console.error("Error: ", response.error);
          reject(response.error);
        } else {
          console.log("Update One Solution Response:", response.raw_body);
          resolve(JSON.parse(response.raw_body));
        }
      });
  });
}

// Remove one solution
async function deleteOne(mongoId) {
  return new Promise((resolve, reject) => {
    unirest
      .delete("https://localhost:9200/test/_doc/" + mongoId)
      .auth(process.env.ES_USERNAME, process.env.ES_PASSWORD)
      .headers({
        "Content-Type": "application/json",
      })
      .strictSSL(false)
      .end(function (response) {
        if (response.error) {
          console.error("Error: ", response.error);
          reject(response.error);
        } else {
          console.log("Remove One Solution Response:", response.raw_body);
          resolve(JSON.parse(response.raw_body));
        }
      });
  });
}

exports.insertAll = insertAll;
exports.insertOne = insertOne;
exports.search = search;
exports.updateOne = updateOne;
exports.deleteOne = deleteOne;
