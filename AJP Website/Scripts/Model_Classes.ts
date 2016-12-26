/**
 * Represents the first unit of grouping items
 */
class CATG {
	/** The display name */
	public Name: string;
	/** The groups within the category */
	public Group: Array<Group>
}

/**
 * Represents the second unit of grouping items
 */
class Group {
	/** The ID of the group */
	public ID: string;
	/** The display name */
	public Name: string;
	/** The products within the group */
	public Product: Array<Product>;
}

/**
 * Represents a product that AJP sells
 */
class Product {
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
	/** Price point 1 */
	public SELL1: string;
	/** Price point 6 */
	public SELL6: string;
	/** Special per customer prices for the item */
	public SP: Array<SP>
}

/**
 * A special price given to a customer for an item
 */
class SP {
	/** Customer name */
	public SP2: string;
	/** Actual price */
	public SP7: string;
	/** Tells you what the normal price is? */
	public SP8: string;
}