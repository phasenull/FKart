import { Fragment, useEffect, useState } from "react";
import { Avatar, Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { Translated, validate } from "../../util";
import { useColorScheme } from "nativewind";


export default function Panel_LogIn(props) {
	const [data, setData] = useState({
		email: "",
		password: ""
	});
	const [loading, set_loading] = useState(false);
	const [errors, set_errors] = useState({
	})
	useEffect(() => {
		const [email_success, email_error] = validate(data.email, "email");
		const [password_success, password_error] = validate(data.password, "password");
		set_errors({...errors,email: email_error, password: password_error})
	}, [data])
	const [show_password, set_show_password] = useState(false);
	async function send_data() {
		set_errors({...errors,email: !data.email && "Please enter an email address", password: !data.password && "Please enter a password"})
		if (!validate_fields()) {return}
		set_loading(true);
	}
	function check_fields() {
		return data.email && data.password
	}
	function validate_fields() {
		if (!check_fields()) {return}
		const [email_success, email_error] = validate(data.email, "email");
		const [password_success, password_error] = validate(data.password, "password");
		return email_success && password_success
	}
	return (
		<Fragment>
			<Card.Content className="gap-y-5">
				<TextInput
					label= {`${Translated("email")}`}
					value={data.email}
					inputMode="email"
					onChangeText={text => setData({ ...data, email: text })}
					error={errors.email}
				/>
				<Text style={{color:useTheme().colors.error}} className={"font-bold ml-3 " +  (errors.email ? "" : "hidden")}>{errors.email ? "- " + errors.email : null}</Text>
				<TextInput
					secureTextEntry={!show_password}
					label={`${Translated("password")}`}
					value={data.password}
					onChangeText={text => setData({ ...data, password: text })}
					right={
						<TextInput.Icon icon={show_password ? "eye-off" : "eye"} onPress={()=>{set_show_password(!show_password)}} />
					}
					error={errors.password}
				/>
				<Text style={{color:useTheme().colors.error}} className={"font-bold ml-3 " +  (errors.password ? "" : "hidden")}>{errors.password ? "- " + errors.password : null}</Text>
			</Card.Content>
			<Button className="mx-auto mt-5 justify-center" contentStyle={
				{
					height: 50,
					width: 150,
				}
			}
				loading={loading}
				disabled={loading}
				onPress={send_data}
				style={{
					borderRadius: 12,
				}}
				mode="contained">
				{`${Translated(loading ? "loading" : "login")}`}
			</Button>

		</Fragment>
	)
}