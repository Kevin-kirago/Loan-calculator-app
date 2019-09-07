// ///////////////////////////////////////////////////////////////
// Loan Controller
// ///////////////////////////////////////////////////////////////

const LoanController = (function() {
	class Loan {
		constructor(id, amount, interest, years) {
			this.id = id;
			this.amount = amount;
			this.interest = interest;
			this.years = years;
			this.totals = -1;
		}

		calcTotals = () => {
			this.totals = parseFloat(this.amount) + this.amount * (this.interest / 100) * this.years;
		};

		getTotals = () => {
			return this.totals;
		};
	}

	const data = {
		field: [],
		totalReturn: 0
	};

	const calculateReturnInterest = () => {
		let int,
			sum = 0;

		data.field.forEach(cur => {
			int = cur.amount * (cur.interest / 100) * cur.years;
			sum += parseFloat(cur.amount) + int;
		});

		data.totalReturn = sum;
	};

	return {
		// 1. Add fields to our data structure
		addFields: (amount, interest, years) => {
			let newRecord, id;

			if (data.field.length > 0) {
				id = data.field[data.field.length - 1].id + 1;
			} else {
				id = 0;
			}

			newRecord = new Loan(id, amount, interest, years);
			data.field.push(newRecord);

			return newRecord;
		},

		// 2. Total for the individual record
		calculateTotal: () => {
			data.field.forEach(curr => {
				curr.calcTotals();
			});
		},

		// 3. Calculate the total loan return
		calculateReturnTotals: () => {
			calculateReturnInterest();
		},

		// Testing
		testing: () => {
			return data;
		}
	};
})();

// ///////////////////////////////////////////////////////////////
// UI / View Controller
// ///////////////////////////////////////////////////////////////

const ViewController = (function() {
	// Global dom strings
	var domStrings = {
		container: ".container",
		amount: "amount",
		interest: "interest",
		years: "years",
		btnCalculate: "btn-calculate"
	};

	return {
		getInput: () => {
			return {
				amount: document.getElementById(domStrings.amount).value,
				interest: document.getElementById(domStrings.interest).value,
				years: document.getElementById(domStrings.years).value
			};
		},

		// Clear the input fields and set the first field to focus
		clearInputFields: () => {
			let fields;

			fields = document.getElementById(domStrings.amount);
			fields.value = "";
			document.getElementById(domStrings.interest).value = "";
			document.getElementById(domStrings.years).value = "";

			fields.focus();
		},

		getDomStrings: () => {
			return domStrings;
		}
	};
})();

// ///////////////////////////////////////////////////////////////
// App Controller
// ///////////////////////////////////////////////////////////////

const AppController = (function(dataMd, uiCtrl) {
	const setUpEventListener = () => {
		var dom = uiCtrl.getDomStrings();
		// add Event handler
		document.getElementById(dom.btnCalculate).addEventListener("click", calculateTotals);

		document.addEventListener("keypress", event => {
			if (event.keyCode === 13 || event.which === 13) {
				calculateTotals();
			}
		});
	};

	const calculateTotals = () => {
		let input;

		// 1. Get the input data
		input = uiCtrl.getInput();

		if (input.amount !== "" && input.interest !== "" && input.years !== "") {
			// 2. Add the data in a data structure
			dataMd.addFields(input.amount, input.interest, input.years);

			// 3. calculate the individual return total for every record
			dataMd.calculateTotal();

			// 4. Add the new item to the input box
		}
	};

	return {
		init() {
			console.log("Application has started ...");
			setUpEventListener();
		}
	};
})(LoanController, ViewController);

AppController.init();
