class IssueFilter extends React.Component {
  render() {
    return React.createElement("div", null, "Showing all avalible products");
  }

}

function IssueRow(props) {
  const issue = props.issue;
  return React.createElement("tr", null, React.createElement("td", null, issue.id), React.createElement("td", null, issue.name), React.createElement("td", null, "$", issue.price), React.createElement("td", null, issue.category), React.createElement("td", null, React.createElement("a", {
    href: issue.image,
    target: "_blank"
  }, "view")));
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue => React.createElement(IssueRow, {
    key: issue.id,
    issue: issue
  }));
  return React.createElement("table", {
    className: "bordered-table",
    border: "2"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product ID"), React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, issueRows));
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      category: form.category.value,
      price: form.price.value.replace("$", ""),
      name: form.name.value,
      image: form.image.value
    };
    this.props.createIssue(issue);
    form.category.value = "Shirts";
    form.price.value = "$";
    form.name.value = "";
    form.image.value = "";
  }

  render() {
    return React.createElement("form", {
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, "Category:", React.createElement("br", null), React.createElement("select", {
      name: "category"
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories")), React.createElement("br", null), "Price Per Unit:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      placeholder: "$"
    }), React.createElement("br", null), "Product Name:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Product Name"
    }), React.createElement("br", null), "Image URL:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "image",
      placeholder: "Image"
    }), React.createElement("br", null), React.createElement("button", null, "Add Product"));
  }

}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
    issueList {
    id name category price image
}
}`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      issues: result.data.issueList
    });
  }

  async searchIssue(name) {
    const allUsersQuery = `
	query issueList($Id: Int!){
    issueList(
      filter: {id: $Id}
    ) {
      id
      name
	  price
	  category
	  imgae
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          issue
        }
      })
    });
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
	issueAdd(issue: $issue) {
			id
		}
	}`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          issue
        }
      })
    });
    this.loadData();
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My company Inventory"), React.createElement(IssueFilter, null), React.createElement("hr", null), React.createElement(IssueTable, {
      issues: this.state.issues
    }), React.createElement("hr", null), React.createElement("h2", null, "Add a new product to inventory"), React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }

}

const element = React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('contents'));