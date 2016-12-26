class CATG extends Array<Object> {
	public Name: string;
	public Group: Group
}

class Group extends Array<Object> {
	public ID: string;
	public Name: string;
	public Product: Array<Product>;
}

class Product extends Array<SP> {
	/** The ID of the Record */
	public ID: string;
	/** The Name of the item */
	public Name: string;
	/** The unit it was sold in */
	public Case: string;

	/** The ID number of the item's vendor that will be used in place of the name until further notice */
	public VenderID: string;
	/** The purchase cost (I think) */
	public LINECOST: string;
	/** The */
	public SELL1: string;
	public SELL6: string;
}

/**
 * A special price given to a customer for an item
 */
class SP {
}