import EntityProperties from "../entityProperties/EntityProperties";
import UserTable from "../../../../components/Table/UserTable";

export default class UserProperties extends EntityProperties{

    buildTable = () => {
        return <UserTable table={this.state.table} data={this.state.tableData} loading={this.state.loading} />
    }

}