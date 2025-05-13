export type ConditionOperator = "=" | ">" | "<" | ">=" | "<=" | "!=" | "ILIKE" | "IN" | "&&";

export interface Condition {
	column: string;
	operator: ConditionOperator;
	value: any;
}

export function selectWhereFlexible(table: string, conditions: Condition[]) {
	const values: any[] = [];
	const whereClauses = conditions.map((cond, i) => {
		const placeholder = `$${i + 1}`;
		values.push(cond.value);
		return `${cond.column} ${cond.operator} ${placeholder}`;
	});

	const text = conditions.length > 0
	? `SELECT * FROM ${table} WHERE ${whereClauses.join(" AND ")}`
	: `SELECT * FROM ${table}`;
	return { text, values };
}

export function insertQuery<T extends Record<string, any>>(table: string, data: T) {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const placeholders = keys.map((_, i) => `$${i + 1}`);

	const text = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
	return { text, values };
}

export function selectWhere<T extends Record<string, any>>(table: string, conditions: T) {
	const keys = Object.keys(conditions);
	const values = Object.values(conditions);
	const whereClause = keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");

	const text = keys.length > 0
	? `SELECT * FROM ${table} WHERE ${whereClause}`
	: `SELECT * FROM ${table}`;
	return { text, values };
}

export function updateQuery<T extends Record<string, any>>(table: string, data: T, conditions: Partial<T>) {
	const setKeys = Object.keys(data);
	const setValues = Object.values(data);
	const setClause = setKeys.map((k, i) => `${k} = $${i + 1}`).join(", ");

	const whereKeys = Object.keys(conditions);
	const whereValues = Object.values(conditions);
	const whereClause = whereKeys.map((k, i) => `${k} = $${setKeys.length + i + 1}`).join(" AND ");

	const text = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
	return { text, values: [...setValues, ...whereValues] };
}

export function deleteQuery<T extends Record<string, any>>(table: string, conditions: T) {
	const keys = Object.keys(conditions);
	const values = Object.values(conditions);
	const whereClause = keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");

	const text = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
	return { text, values };
}
