
async function initializePyodide() {
    // probably redundant??
    console.log("Loading pyodide");
    let pyodide = await loadPyodide();
    console.log("Done loading.");
    return pyodide;
}
let pyodideReadyPromise = initializePyodide();

async function main(){
    let code = document.getElementById("code").textContent;
    let functionName = "add_numbers";
    let cases = [
        [[2, 3], 5], 
        [[5, 5], 10], 
        [[0, 0], 0], 
        [[1, 3], 4],
    ]
    let results = await testCode(code, functionName, cases);

    let table = buildTable(cases, results);
    let tableContainer = document.getElementById("table-container")
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);

    console.log(results)
}

async function testCode(code, functionName, cases) {
    let pyodide = await pyodideReadyPromise;

    // Loads the python code, defining the function that we want to test
    pyodide.runPython(code);
    let pythonFunction = pyodide.globals.get(functionName);

    // Results of each case
    return cases.map(element => {
        let args = element[0];
        let intendedResult = element[1];
        
        let actualResult = pythonFunction.apply(null, args);

        // e.g. [4, true]
        return [actualResult, actualResult == intendedResult];
    });
}

function buildTable(cases, results) {
    let table = document.createElement("table");
    table.className = "table border"

    const headerRow = ["Arguments", "Solution", "Result", "Correct"];
    table.appendChild( buildRow(headerRow) );

    results.forEach((result, i) => {
        cases[i].push(...result);
    });
    
    console.log(cases)

    cases.forEach((element) => {
        table.appendChild(
            buildRow(element)
        );
    });

    return table;
}

function buildRow(array) {
    let row = document.createElement("tr");
    array.forEach(e => {
        let entry = document.createElement("th");
        entry.className = "border p-2"
        entry.textContent = e;
        row.appendChild(entry);
    })
    return row;
}