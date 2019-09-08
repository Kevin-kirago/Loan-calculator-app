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
			this.interestAmount = -1;
		}

		// Setters and getters
		setTotals = totalInt => {
			if (totalInt > 0) {
				this.totals = parseFloat(this.amount) + this.amount * (this.interest / 100) * this.years;
			} else {
				this.totals = 0;
			}
		};

		setInterest = totalInt => {
			if (totalInt > 0) {
				this.interestAmount = this.amount * (this.interest / 100) * this.years;
			} else {
				this.interestAmount = 0;
			}
		};
		getTotals = () => {
			return this.totals;
		};

		getInterest = () => {
			return this.interestAmount;
		};
	}

	const calculateReturnInterest = () => {
		let int,
			sum = 0;

		data.field.forEach(cur => {
			int = cur.amount * (cur.interest / 100) * cur.years;
			sum += parseFloat(cur.amount) + int;
		});

		data.totalReturn = sum;
	};

	const data = {
		field: [],
		totalReturn: 0
	};

	return {
		// 1. Add fields to our data structure
		addFields: (amount, interest, years) => {
			let newRecord, id;

			// Generate unique ids for each record
			if (data.field.length > 0) {
				id = data.field[data.field.length - 1].id + 1;
			} else {
				id = 0;
			}

			newRecord = new Loan(id, amount, interest, years);
			data.field.push(newRecord);

			return newRecord;
		},

		// Remove item from our data structure
		removeField: id => {
			let ids, index;

			ids = data.field.map(curr => {
				return curr.id;
			});

			index = ids.indexOf(id);

			if (index !== 1) {
				data.field.splice(index, 1);
			}
		},

		// 2. Total for the individual record
		calculateTotal: () => {
			data.field.forEach(curr => {
				curr.setTotals(data.totalReturn);
			});
		},

		// 3. calculate interest for each record
		calculateInterest: () => {
			data.field.forEach(curr => {
				curr.setInterest(data.totalReturn);
			});
		},

		// 4. Calculate the total loan return
		calculateReturnTotals: () => {
			calculateReturnInterest();
		},

		updateReturnTotal: id => {
			data.field.forEach(curr => {
				if (curr.id === id) {
					data.totalReturn = data.totalReturn - (parseInt(curr.amount) + parseInt(curr.interestAmount));
				}
			});
		},

		getLoanRecords: () => {
			return data.field;
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
		btnCalculate: "btn-calculate",
		return: "totalReturn",
		btnAdd: "btn-add",
		rightContainer: ".right",
		listContainer: ".totals__list"
	};

	return {
		getInput: () => {
			return {
				amount: document.getElementById(domStrings.amount).value,
				interest: document.getElementById(domStrings.interest).value,
				years: document.getElementById(domStrings.years).value
			};
		},

		addTotalRetunToUi: obj => {
			let retInputVal = document.getElementById(domStrings.return);
			retInputVal.value = obj.totals;
		},

		// Add records to the ui
		addRecordToUi: obj => {
			let html, element;

			element = domStrings.listContainer;
			html = `
			<div class="record" id="record-${obj.id}">
				<div class="record__content">
					<div class="record__payment">
						<span class="record__label">Total Payment:</span>${obj.totals}
					</div>
					<div class="record__interest">
						<span class="record__label">Total Interests:</span>${obj.interestAmount}
					</div>
					<div class="record__years">
						<span class="record__label">Total n.o Year:</span>${obj.years}
					</div>
				</div>
				<div class="record__delete">
					<button class="record__delete-btn">Remove</button>
				</div>
			</div>`;

			document.querySelector(element).insertAdjacentHTML("beforeend", html);
		},

		// Remove record from UI
		removeRecordFromUi: selectorId => {
			let el = document.getElementById(selectorId);
			el.parentNode.removeChild(el);
		},

		// Clear the input fields and set the first field to focus
		clearInputFields: () => {
			let fields;

			fields = document.getElementById(domStrings.amount);
			fields.value = "";
			document.getElementById(domStrings.interest).value = "";
			document.getElementById(domStrings.years).value = "";
			document.getElementById(domStrings.return).value = "";

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
	let dom = uiCtrl.getDomStrings();

	const setUpEventListener = () => {
		// Event handlers
		document.getElementById(dom.btnCalculate).addEventListener("click", calculateTotals);

		document.addEventListener("keypress", event => {
			if (event.keyCode === 13 || event.which === 13) {
				calculateTotals();
			}
		});

		document.getElementById(dom.btnAdd).addEventListener("click", addRecordToList);

		document.querySelector(dom.rightContainer).addEventListener("click", removeRecordFromList);
	};

	const calculateTotals = () => {
		let input, newRecord;

		// 1. Get the input data
		input = uiCtrl.getInput();

		if (input.amount !== "" && input.interest !== "" && input.years !== "") {
			// 2. Add the data in a data structure
			newRecord = dataMd.addFields(input.amount, input.interest, input.years);

			// 3. Calculate the total amout amout of return in each record
			dataMd.calculateReturnTotals();

			// 4. calculate the individual return total for every record
			dataMd.calculateTotal();

			// 5. calculate interest on each record
			dataMd.calculateInterest();

			// 6. Add the new item to the input box
			uiCtrl.addTotalRetunToUi(newRecord);
		}

		return newRecord;
	};

	const addRecordToList = () => {
		let data;

		if (dom.return !== "" && dom.return !== 0) {
			// 1. Get the input data
			data = dataMd.getLoanRecords();

			// 2. The add the data to the ui
			uiCtrl.addRecordToUi(data[data.length - 1]);

			// 3. Clear input fields
			uiCtrl.clearInputFields();
		}
	};

	const removeRecordFromList = event => {
		let itemId, splitId, id;
		itemId = event.target.parentNode.parentNode.id;

		if (itemId) {
			splitId = itemId.split("-");
			id = parseInt(splitId[1]);

			// Update Totals
			dataMd.updateReturnTotal(id);

			// Remove item from our data structure
			dataMd.removeField(id);

			// Remove item from the ui
			uiCtrl.removeRecordFromUi(itemId);
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
