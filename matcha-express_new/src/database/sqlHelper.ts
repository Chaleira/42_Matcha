export type ConditionOperator = "" | "=" | ">" | "<" | ">=" | "<=" | "!=" | "ILIKE" | "IN" | "&&" | "IS NOT NULL";

export interface Condition {
	column?: string;
	operator?: ConditionOperator;
	value: any;
}

export function selectWhereFlexible(table: string, conditions: Condition[], user: {id: number, latitude: number, longitude: number, tags?: string[]}, orderBy?: string) {
	const values: any[] = [];
	const whereClauses = conditions.map((cond, i) => {
		const placeholder = `$${values.length + 1}`;
		let clause = "";

		if (!cond.column) {
			values.push(cond.value);
			return;
		}
		if (cond.operator === "IN" && Array.isArray(cond.value)) clause = `${cond.column} = ANY(${placeholder}::text[])`;
		else if (cond.operator === "IS NOT NULL") return `${cond.column} ${cond.operator}`;
		else clause = `${cond.column} ${cond.operator} ${placeholder}`;
		values.push(cond.value);
		return clause;
	});

	let selectFields = [`${table}.*`];
	selectFields.push(`6371 * acos(LEAST(GREATEST(
						cos(radians(${user.latitude})) * cos(radians(profiles.latitude)) *
						cos(radians(profiles.longitude) - radians(${user.longitude})) +
						sin(radians(${user.latitude})) * sin(radians(profiles.latitude))
						, -1), 1)) AS distance`);

	selectFields.push(`cardinality(ARRAY(
			SELECT UNNEST(profiles.tags)
			INTERSECT SELECT UNNEST($${values.length + 2}::text[])
		)) AS shared_tags`);
	let text = `SELECT ${selectFields.join(", ")} FROM ${table}`;
	text += " JOIN users ON users.id = profiles.user_id";

	if (conditions.length > 0 || user.id !== undefined) text += " WHERE ";
	if (conditions.length > 0) text += whereClauses.join(" AND ");
	if (user.id !== undefined) {
		if (conditions.length > 0) text += " AND ";
		text += `user_id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = $${values.length + 1})`;
		values.push(user.id);
	}
	if (orderBy === "distance")
		text += ` ORDER BY ${orderBy} ASC, shared_tags DESC, fame_score DESC`;
	else if (orderBy === "shared_tags")
		text += ` ORDER BY ${orderBy} DESC, distance ASC, fame_score DESC`;
	else if (orderBy === "fame_score")
		text += ` ORDER BY ${orderBy} DESC, distance ASC, shared_tags DESC`;
	else if (orderBy === "age")
		text += ` ORDER BY ${orderBy} ASC, distance ASC, shared_tags DESC, fame_score DESC`;
	else text += ` ORDER BY distance ASC, shared_tags DESC, fame_score DESC`;

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

	const text = keys.length > 0 ? `SELECT * FROM ${table} WHERE ${whereClause}` : `SELECT * FROM ${table}`;
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
