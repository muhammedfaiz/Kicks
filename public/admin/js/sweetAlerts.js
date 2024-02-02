function toggleCategoryStatus(categoryId) {
    $.ajax({
        url: `/admin/category-remove/${categoryId}`,
        type: "PATCH",

        success: function (response) {
            // Handle success, update the UI if needed
            location.reload();
            
        },
        error: function (error) {
            console.error(error);
            // Handle error
        }
    });
}

function toggleProductStatus(productId){
    $.ajax({
        url:`/admin/product-status/${productId}`,
        type:"PATCH",
        success: function (response) {
            console.log(response);
            // Handle success, update the UI if needed
            location.reload();
            
        },
        error: function (error) {
            console.error(error);
            // Handle error
        }
    });
}


function productDelete(productId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If user confirms, perform the delete using Ajax
            $.ajax({
                url: `/admin/product-delete/${productId}`,
                type: 'DELETE',
                success: function () {
                    // Reload the page after successful deletion
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    ).then(() => {
                        location.reload();
                    });
                },
                error: function (error) {
                    console.log(error);
                    // Display an error message using SweetAlert
                    Swal.fire(
                        'Error!',
                        'Could not delete the file.',
                        'error'
                    );
                }
            });
        }
    });
}

function toggleUserStatus(userId){
    Swal.fire(
        {
        title: 'Are you sure?',
        text: "change status of the user!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change!'
    }
    ).then((result)=>{
        if (result.isConfirmed) {
            $.ajax({
                url:`/admin/user-status/${userId}`,
                type:"PATCH",
                success:function(){
                    Swal.fire(
                        'Changed!',
                        'Your user status has been changed.',
                        'success'
                    ).then(()=>{
                        location.reload();
                    });
                },
                error:function(){
                    Swal.fire(
                        'Error!',
                        'Could not change the status.',
                        'error'
                    );
                }
            })
        }
    })
}
