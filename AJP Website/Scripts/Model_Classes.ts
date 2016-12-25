class CATG extends Array<Object> {
	public Name: string;
	public Group: Group
}

class Group extends Array<Object> {
	public ID: string;
	public Name: string;
	public Product: Array<Product>;
}

class Product {
	public ID: string;
	public Name: string;
	public Case: string;
	public VenderID: string;
	public LINECOST: string;
	public SELL1: string;
	public SELL6: string;
}