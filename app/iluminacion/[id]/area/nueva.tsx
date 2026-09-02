import ViewWithLogo from '@/components/ViewWithLogo'
import VolverBtn from '@/components/VolverBtn'
import { Text, ScrollView } from 'react-native'

export default function AreaNueva() {
  return (
	<ViewWithLogo>
				<ScrollView
					contentContainerStyle={{ justifyContent: "center" }}
					style={{
						flex: 1,
						paddingHorizontal: 10,
					}}
				>
					<VolverBtn
										title="Nueva Area"
										href="/(iluminacion)/nuevo"
										header="medicion"
									/>
	  <Text>AreaNueva</Text>
	  </ScrollView>
	</ViewWithLogo>
  )
}